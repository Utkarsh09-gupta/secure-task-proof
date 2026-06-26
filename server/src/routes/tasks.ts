import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// Protect all task endpoints
router.use(authenticateToken as any);

// Get tasks
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let tasks;

    if (role === 'client') {
      tasks = await prisma.task.findMany({
        where: { clientId: userId },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    } else if (role === 'freelancer') {
      // Freelancers get tasks assigned to them, OR tasks that are posted (available to accept)
      tasks = await prisma.task.findMany({
        where: {
          OR: [
            { assigneeId: userId },
            { status: 'posted' }
          ]
        },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    } else {
      // Admin sees everything
      tasks = await prisma.task.findMany({
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    }

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get task by ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        milestones: {
          include: { deliverables: true }
        }
      }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create task (Client only)
router.post('/', async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'client') {
      return res.status(403).json({ error: 'Only clients can create tasks' });
    }

    const { title, description, totalAmount, milestones } = req.body;
    const clientId = req.user.id;

    // Use prisma transaction to create tasks, milestones and deliverables
    const createdTask = await prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title,
          description,
          totalAmount,
          clientId,
          status: 'posted',
          paymentStatus: 'pending',
          contractLocked: false,
        }
      });

      for (let i = 0; i < milestones.length; i++) {
        const m = milestones[i];
        const dbMilestone = await tx.milestone.create({
          data: {
            title: m.title,
            amount: m.amount,
            status: 'pending',
            taskId: task.id,
            revisionCount: 0,
          }
        });

        if (m.deliverables && m.deliverables.length > 0) {
          await tx.deliverable.createMany({
            data: m.deliverables.map((d: any) => ({
              title: d.title,
              completed: false,
              milestoneId: dbMilestone.id,
            }))
          });
        }
      }

      return tx.task.findUnique({
        where: { id: task.id },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    });

    res.status(201).json(createdTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update general task updates
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if task exists
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ error: 'Task not found' });
    
    // Verify client
    if (req.user?.role !== 'admin' && existingTask.clientId !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updates,
      include: {
        milestones: {
          include: { deliverables: true }
        }
      }
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Accept task (Freelancer only)
router.put('/:id/accept', async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'freelancer') {
      return res.status(403).json({ error: 'Only freelancers can accept tasks' });
    }

    const { id } = req.params;
    const freelancerId = req.user.id;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.status !== 'posted') {
      return res.status(400).json({ error: 'Task has already been accepted or is not active' });
    }

    const updatedTask = await prisma.$transaction(async (tx) => {
      // Accept task, lock contract, set milestones to in_progress or pending
      const accepted = await tx.task.update({
        where: { id },
        data: {
          assigneeId: freelancerId,
          assigneeRole: 'freelancer',
          status: 'in_progress',
          contractLocked: true,
        },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });

      // Set the first milestone status to 'in_progress' and others to 'pending'
      if (accepted.milestones.length > 0) {
        await tx.milestone.update({
          where: { id: accepted.milestones[0].id },
          data: { status: 'in_progress' }
        });
      }

      return tx.task.findUnique({
        where: { id },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Milestone Work (Freelancer only)
router.put('/:id/milestones/:milestoneId/submit', async (req: AuthRequest, res) => {
  try {
    const { id, milestoneId } = req.params;
    const { submissionUrl, submissionNote } = req.body;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { milestones: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.assigneeId !== req.user?.id) {
      return res.status(403).json({ error: 'Only the assigned freelancer can submit work' });
    }

    const milestone = task.milestones.find(m => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });

    const updated = await prisma.$transaction(async (tx) => {
      await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          status: 'submitted',
          submissionUrl,
          submissionNote,
        }
      });

      // Mark deliverables as completed when milestone is submitted
      await tx.deliverable.updateMany({
        where: { milestoneId },
        data: { completed: true }
      });

      return tx.task.findUnique({
        where: { id },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve Milestone Work (Client only)
router.put('/:id/milestones/:milestoneId/approve', async (req: AuthRequest, res) => {
  try {
    const { id, milestoneId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { milestones: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.clientId !== req.user?.id) {
      return res.status(403).json({ error: 'Only the project client can approve milestones' });
    }

    const milestone = task.milestones.find(m => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status !== 'submitted') {
      return res.status(400).json({ error: 'Milestone has not been submitted for review yet' });
    }

    // Get client info to attach to proof card
    const client = await prisma.user.findUnique({ where: { id: task.clientId } });
    const clientName = client?.name || 'Client';

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Approve milestone
      await tx.milestone.update({
        where: { id: milestoneId },
        data: { status: 'approved' }
      });

      // 2. Create Proof Card
      const randomString = Math.random().toString(36).substring(2, 8);
      await tx.proofCard.create({
        data: {
          taskId: task.id,
          taskTitle: task.title,
          milestoneTitle: milestone.title,
          userRole: 'freelancer',
          workSummary: milestone.submissionNote || 'Work completed successfully',
          evidenceUrl: milestone.submissionUrl || '',
          clientApproval: true,
          clientName: clientName,
          verified: true,
          publicLink: `https://nexa.app/proof/${randomString}`,
        }
      });

      // 3. Check if all milestones are now approved
      const allMilestones = await tx.milestone.findMany({ where: { taskId: task.id } });
      const allApproved = allMilestones.every(m => m.status === 'approved');

      if (allApproved) {
        // Complete the task
        await tx.task.update({
          where: { id: task.id },
          data: { status: 'completed' }
        });

        // Increment completed tasks counters
        if (task.assigneeId) {
          await tx.user.update({
            where: { id: task.assigneeId },
            data: { completedTasks: { increment: 1 } }
          });
        }
        await tx.user.update({
          where: { id: task.clientId },
          data: { completedTasks: { increment: 1 } }
        });
      } else {
        // If not all approved, set the next pending milestone to in_progress
        const approvedIndex = allMilestones.findIndex(m => m.id === milestoneId);
        const nextMilestone = allMilestones[approvedIndex + 1];
        if (nextMilestone && nextMilestone.status === 'pending') {
          await tx.milestone.update({
            where: { id: nextMilestone.id },
            data: { status: 'in_progress' }
          });
        }
      }

      return tx.task.findUnique({
        where: { id },
        include: {
          milestones: {
            include: { deliverables: true }
          }
        }
      });
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Request Revision (Client only)
router.put('/:id/milestones/:milestoneId/revision', async (req: AuthRequest, res) => {
  try {
    const { id, milestoneId } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { milestones: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.clientId !== req.user?.id) {
      return res.status(403).json({ error: 'Only the project client can request revisions' });
    }

    const milestone = task.milestones.find(m => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Milestone not found' });
    if (milestone.status !== 'submitted') {
      return res.status(400).json({ error: 'Milestone has not been submitted for review yet' });
    }
    if (milestone.revisionCount >= 2) {
      return res.status(400).json({ error: 'Maximum revision limit reached (2 revisions max)' });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        milestones: {
          update: {
            where: { id: milestoneId },
            data: {
              status: 'revision_requested',
              revisionCount: { increment: 1 }
            }
          }
        }
      },
      include: {
        milestones: {
          include: { deliverables: true }
        }
      }
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Task as Paid (Client only)
router.put('/:id/pay', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.clientId !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to make payment' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { paymentStatus: 'paid' },
      include: {
        milestones: {
          include: { deliverables: true }
        }
      }
    });

    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
