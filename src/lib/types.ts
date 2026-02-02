export type UserRole = 'client' | 'freelancer' | 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills?: string[];
  completedTasks?: number;
  paymentBehavior?: 'on-time' | 'delayed';
}

export interface Deliverable {
  id: string;
  title: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  deliverables: Deliverable[];
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision_requested';
  revisionCount: number;
  submissionUrl?: string;
  submissionNote?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  totalAmount: number;
  clientId: string;
  assigneeId?: string;
  assigneeRole?: 'freelancer' | 'student';
  milestones: Milestone[];
  status: 'draft' | 'posted' | 'accepted' | 'in_progress' | 'completed';
  paymentStatus: 'pending' | 'paid';
  createdAt: Date;
  contractLocked: boolean;
}

export interface ProofCard {
  id: string;
  taskId: string;
  taskTitle: string;
  milestoneTitle: string;
  userRole: 'freelancer' | 'student';
  workSummary: string;
  evidenceUrl: string;
  clientApproval: boolean;
  clientName: string;
  timestamp: Date;
  verified: boolean;
  publicLink: string;
}
