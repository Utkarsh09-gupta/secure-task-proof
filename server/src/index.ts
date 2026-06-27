import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import proofRouter from './routes/proof.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || 
        !process.env.FRONTEND_URL || 
        process.env.FRONTEND_URL === '*' || 
        process.env.FRONTEND_URL === 'all' || 
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/proof', proofRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.3-upsert-seeding', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Database Auto-Seeding for hosted containers
async function autoSeed() {
  try {
    console.log('Running auto-seed check...');
    const passwordHash = bcrypt.hashSync('demo123', 10);

    // 1. Seed Users safely
    const seedUsers = [
      {
        id: 'client-001',
        name: 'Sarah Mitchell',
        email: 'sarah@techstartup.com',
        passwordHash,
        role: 'client',
        clientType: 'startup-founder',
        completedTasks: 12,
        paymentBehavior: 'on-time',
      },
      {
        id: 'client-002',
        name: 'Raj Kapoor',
        email: 'raj@digitalagency.com',
        passwordHash,
        role: 'client',
        clientType: 'agency-owner',
        completedTasks: 28,
        paymentBehavior: 'on-time',
      },
      {
        id: 'client-003',
        name: 'Emily Chen',
        email: 'emily@growthco.com',
        passwordHash,
        role: 'client',
        clientType: 'marketing-manager',
        completedTasks: 8,
        paymentBehavior: 'delayed',
      },
      {
        id: 'freelancer-001',
        name: 'Alex Chen',
        email: 'alex@email.com',
        passwordHash,
        role: 'freelancer',
        skills: JSON.stringify(['React', 'TypeScript', 'Figma', 'Tailwind CSS']),
        serviceCategories: JSON.stringify(['frontend-developer', 'ui-ux-designer']),
      },
      {
        id: 'freelancer-002',
        name: 'Priya Sharma',
        email: 'priya@email.com',
        passwordHash,
        role: 'freelancer',
        skills: JSON.stringify(['Premiere Pro', 'After Effects', 'DaVinci Resolve']),
        serviceCategories: JSON.stringify(['video-editor', 'reel-editor']),
      },
      {
        id: 'freelancer-003',
        name: 'Marcus Johnson',
        email: 'marcus@email.com',
        passwordHash,
        role: 'freelancer',
        skills: JSON.stringify(['Node.js', 'Python', 'PostgreSQL', 'AWS']),
        serviceCategories: JSON.stringify(['fullstack-developer', 'backend-developer']),
      },
      {
        id: 'admin-001',
        name: 'System Admin',
        email: 'admin@nexa.app',
        passwordHash,
        role: 'admin',
      }
    ];

    for (const u of seedUsers) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u
      });
    }

    // 2. Seed Tasks safely
    const seedTasks = [
      {
        id: 'task-001',
        title: 'E-commerce Dashboard Design',
        description: 'Design a complete high-fidelity dashboard for a modern B2B e-commerce platform. Requirements include: user management, order workflows, sales metrics, and export capabilities. Deliver in Figma with components and styling libraries organized.',
        totalAmount: 45000,
        status: 'in-progress',
        paymentStatus: 'pending',
        clientId: 'client-001',
        assigneeId: 'freelancer-001',
        contractLocked: true,
      },
      {
        id: 'task-002',
        title: 'Promotional Video Editing',
        description: 'Edit a 60-second product launch video for social media campaigns. Include: dynamic cuts, audio leveling, background track selection, color correction, and dynamic captions. Final deliverable must be format-ready for both Instagram Reels (9:16) and YouTube (16:9).',
        totalAmount: 18000,
        status: 'in-progress',
        paymentStatus: 'pending',
        clientId: 'client-002',
        assigneeId: 'freelancer-002',
        contractLocked: true,
      }
    ];

    for (const t of seedTasks) {
      await prisma.task.upsert({
        where: { id: t.id },
        update: {},
        create: t
      });
    }

    // 3. Seed Milestones safely
    const seedMilestones = [
      {
        id: 'milestone-1-1',
        taskId: 'task-001',
        title: 'Wireframes & User Flows',
        description: 'Establish structural maps, page architectures, and user progression pathways for main dashboard panels.',
        amount: 15000,
        status: 'approved',
      },
      {
        id: 'milestone-1-2',
        taskId: 'task-001',
        title: 'High-Fidelity Designs',
        description: 'Deliver complete page mockups, visual components, styling guides, and click-through interactions in Figma.',
        amount: 30000,
        status: 'pending',
      },
      {
        id: 'milestone-2-1',
        taskId: 'task-002',
        title: 'First Cut Review',
        description: 'Deliver the rough structural edit matching the script outline and timing constraints.',
        amount: 8000,
        status: 'pending',
      },
      {
        id: 'milestone-2-2',
        taskId: 'task-002',
        title: 'Final Rendering & Delivery',
        description: 'Perform audio mastering, complete color correction, overlays, and export deliverables in the requested aspect ratios.',
        amount: 10000,
        status: 'pending',
      }
    ];

    for (const m of seedMilestones) {
      await prisma.milestone.upsert({
        where: { id: m.id },
        update: {},
        create: m
      });
    }

    console.log('✅ Hosted database auto-seeded successfully.');
  } catch (error) {
    console.error('❌ Auto-seed failed:', error);
  }
}

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Nexa Backend Server running at http://localhost:${PORT}`);
  await autoSeed();
});
