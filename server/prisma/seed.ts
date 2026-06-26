import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // Clean up database
  await prisma.proofCard.deleteMany({});
  await prisma.deliverable.deleteMany({});
  await prisma.milestone.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = bcrypt.hashSync('demo123', 10);

  // 1. Seed Users
  const client1 = await prisma.user.create({
    data: {
      id: 'client-001',
      name: 'Sarah Mitchell',
      email: 'sarah@techstartup.com',
      passwordHash,
      role: 'client',
      clientType: 'startup-founder',
      completedTasks: 12,
      paymentBehavior: 'on-time',
    },
  });

  const client2 = await prisma.user.create({
    data: {
      id: 'client-002',
      name: 'Raj Kapoor',
      email: 'raj@digitalagency.com',
      passwordHash,
      role: 'client',
      clientType: 'agency-owner',
      completedTasks: 28,
      paymentBehavior: 'on-time',
    },
  });

  const client3 = await prisma.user.create({
    data: {
      id: 'client-003',
      name: 'Emily Chen',
      email: 'emily@growthco.com',
      passwordHash,
      role: 'client',
      clientType: 'marketing-manager',
      completedTasks: 8,
      paymentBehavior: 'delayed',
    },
  });

  const freelancer1 = await prisma.user.create({
    data: {
      id: 'freelancer-001',
      name: 'Alex Chen',
      email: 'alex@email.com',
      passwordHash,
      role: 'freelancer',
      skills: JSON.stringify(['React', 'TypeScript', 'Figma', 'Tailwind CSS']),
      serviceCategories: JSON.stringify(['frontend-developer', 'ui-ux-designer']),
    },
  });

  const freelancer2 = await prisma.user.create({
    data: {
      id: 'freelancer-002',
      name: 'Priya Sharma',
      email: 'priya@email.com',
      passwordHash,
      role: 'freelancer',
      skills: JSON.stringify(['Premiere Pro', 'After Effects', 'DaVinci Resolve']),
      serviceCategories: JSON.stringify(['video-editor', 'reel-editor']),
    },
  });

  const freelancer3 = await prisma.user.create({
    data: {
      id: 'freelancer-003',
      name: 'Marcus Johnson',
      email: 'marcus@email.com',
      passwordHash,
      role: 'freelancer',
      skills: JSON.stringify(['Node.js', 'Python', 'PostgreSQL', 'AWS']),
      serviceCategories: JSON.stringify(['fullstack-developer', 'backend-developer']),
    },
  });

  const admin = await prisma.user.create({
    data: {
      id: 'admin-001',
      name: 'System Admin',
      email: 'admin@nexa.app',
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Seeded users.');

  // 2. Seed Tasks
  const task1 = await prisma.task.create({
    data: {
      id: 'task-001',
      title: 'E-commerce Dashboard Design',
      description: 'Design and develop a modern dashboard for an e-commerce platform with analytics, order management, and customer insights.',
      totalAmount: 15000,
      clientId: 'client-001',
      assigneeId: 'freelancer-001',
      assigneeRole: 'freelancer',
      status: 'in_progress',
      paymentStatus: 'pending',
      contractLocked: true,
      createdAt: new Date(),
    },
  });

  console.log('Seeded task.');

  // 3. Seed Milestones
  const ms1 = await prisma.milestone.create({
    data: {
      id: 'ms-001',
      title: 'UI/UX Wireframes',
      amount: 5000,
      status: 'approved',
      revisionCount: 0,
      submissionUrl: 'https://figma.com/wireframes',
      submissionNote: 'Complete wireframes for all 8 screens',
      taskId: 'task-001',
    },
  });

  const ms2 = await prisma.milestone.create({
    data: {
      id: 'ms-002',
      title: 'High-Fidelity Designs',
      amount: 5000,
      status: 'in_progress',
      revisionCount: 0,
      taskId: 'task-001',
    },
  });

  const ms3 = await prisma.milestone.create({
    data: {
      id: 'ms-003',
      title: 'React Implementation',
      amount: 5000,
      status: 'pending',
      revisionCount: 0,
      taskId: 'task-001',
    },
  });

  console.log('Seeded milestones.');

  // 4. Seed Deliverables
  await prisma.deliverable.createMany({
    data: [
      { id: 'd1', title: 'Dashboard wireframe', completed: true, milestoneId: 'ms-001' },
      { id: 'd2', title: 'Orders page wireframe', completed: true, milestoneId: 'ms-001' },
      { id: 'd3', title: 'Analytics wireframe', completed: true, milestoneId: 'ms-001' },
      { id: 'd4', title: 'Final dashboard design', completed: false, milestoneId: 'ms-002' },
      { id: 'd5', title: 'Design system documentation', completed: false, milestoneId: 'ms-002' },
      { id: 'd6', title: 'Working React components', completed: false, milestoneId: 'ms-003' },
      { id: 'd7', title: 'Responsive implementation', completed: false, milestoneId: 'ms-003' },
    ],
  });

  console.log('Seeded deliverables.');

  // 5. Seed Proof Card
  await prisma.proofCard.create({
    data: {
      id: 'proof-001',
      taskId: 'task-001',
      taskTitle: 'E-commerce Dashboard Design',
      milestoneTitle: 'UI/UX Wireframes',
      userRole: 'freelancer',
      workSummary: 'Designed comprehensive wireframes for 8 dashboard screens including analytics, order management, and customer insights.',
      evidenceUrl: 'https://figma.com/wireframes',
      clientApproval: true,
      clientName: 'Sarah Mitchell',
      timestamp: new Date(),
      verified: true,
      publicLink: 'https://nexa.app/proof/abc123',
    },
  });

  console.log('Seeded proof card.');
  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
