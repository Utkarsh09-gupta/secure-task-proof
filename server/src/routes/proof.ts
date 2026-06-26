import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// Public verification endpoint (No auth required)
router.get('/public/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find proof card matching the public link code
    const proofCard = await prisma.proofCard.findFirst({
      where: {
        publicLink: {
          endsWith: `/${code}`
        }
      }
    });

    if (!proofCard) {
      return res.status(404).json({ error: 'Proof card not found or invalid link' });
    }

    res.json(proofCard);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Protected routes
router.use(authenticateToken as any);

// Get proof cards for the current user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let proofCards;

    if (role === 'freelancer') {
      // Find all tasks assigned to this freelancer
      const myTasks = await prisma.task.findMany({
        where: { assigneeId: userId },
        select: { id: true }
      });
      
      const taskIds = myTasks.map(t => t.id);

      // Find proof cards for those tasks
      proofCards = await prisma.proofCard.findMany({
        where: {
          taskId: { in: taskIds }
        }
      });
    } else if (role === 'client') {
      // Find all tasks created by this client
      const myTasks = await prisma.task.findMany({
        where: { clientId: userId },
        select: { id: true }
      });
      
      const taskIds = myTasks.map(t => t.id);

      proofCards = await prisma.proofCard.findMany({
        where: {
          taskId: { in: taskIds }
        }
      });
    } else {
      // Admin gets all proof cards
      proofCards = await prisma.proofCard.findMany();
    }

    res.json(proofCards);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
