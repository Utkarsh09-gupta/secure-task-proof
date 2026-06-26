import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import tasksRouter from './routes/tasks.js';
import proofRouter from './routes/proof.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Nexa Backend Server running at http://localhost:${PORT}`);
});
