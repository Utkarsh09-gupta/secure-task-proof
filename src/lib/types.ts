export type UserRole = 'freelancer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AcceptanceCriterion {
  id: string;
  text: string;
  evidenceUrl?: string;
  evidenceType?: 'file' | 'link';
  status: 'pending' | 'submitted';
}

export interface Milestone {
  id: string;
  title: string;
  amount: number;
  criteria: AcceptanceCriterion[];
  status: 'awaiting_agreement' | 'in_progress' | 'submitted' | 'approved' | 'disputed';
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  freelancerId: string;
  milestones: Milestone[];
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
}

export interface Invoice {
  id: string;
  projectId: string;
  milestoneId: string;
  amount: number;
  status: 'pending' | 'approved' | 'disputed';
  createdAt: Date;
}
