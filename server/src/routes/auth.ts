import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretnexaauthkey';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name, serviceCategories, clientType, skills } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        clientType: role === 'client' ? clientType : undefined,
        serviceCategories: role === 'freelancer' && serviceCategories ? JSON.stringify(serviceCategories) : undefined,
        skills: role === 'freelancer' && skills ? JSON.stringify(skills) : undefined,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientType: user.clientType,
      serviceCategories: user.serviceCategories ? JSON.parse(user.serviceCategories) : undefined,
      skills: user.skills ? JSON.parse(user.skills) : undefined,
      completedTasks: user.completedTasks,
      paymentBehavior: user.paymentBehavior,
    };

    res.status(201).json({ token, user: formattedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientType: user.clientType,
      serviceCategories: user.serviceCategories ? JSON.parse(user.serviceCategories) : undefined,
      skills: user.skills ? JSON.parse(user.skills) : undefined,
      completedTasks: user.completedTasks,
      paymentBehavior: user.paymentBehavior,
    };

    res.json({ token, user: formattedUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Current User Profile
router.get('/me', authenticateToken as any, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientType: user.clientType,
      serviceCategories: user.serviceCategories ? JSON.parse(user.serviceCategories) : undefined,
      skills: user.skills ? JSON.parse(user.skills) : undefined,
      completedTasks: user.completedTasks,
      paymentBehavior: user.paymentBehavior,
    };

    res.json(formattedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific user profile
router.get('/users/:id', authenticateToken as any, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientType: user.clientType,
      serviceCategories: user.serviceCategories ? JSON.parse(user.serviceCategories) : undefined,
      skills: user.skills ? JSON.parse(user.skills) : undefined,
      completedTasks: user.completedTasks,
      paymentBehavior: user.paymentBehavior,
    };

    res.json(formattedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Route: Get all users
router.get('/users', authenticateToken as any, async (req: AuthRequest, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const users = await prisma.user.findMany();
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      clientType: user.clientType,
      serviceCategories: user.serviceCategories ? JSON.parse(user.serviceCategories) : undefined,
      skills: user.skills ? JSON.parse(user.skills) : undefined,
      completedTasks: user.completedTasks,
      paymentBehavior: user.paymentBehavior,
    }));

    res.json(formattedUsers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
