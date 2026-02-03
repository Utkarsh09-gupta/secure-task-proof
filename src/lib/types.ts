export type UserRole = 'client' | 'freelancer' | 'admin';

export type ServiceCategory = 
  | 'frontend-developer'
  | 'backend-developer'
  | 'fullstack-developer'
  | 'android-developer'
  | 'ios-developer'
  | 'cross-platform-developer'
  | 'graphic-designer'
  | 'poster-banner-designer'
  | 'ui-ux-designer'
  | 'video-editor'
  | 'photo-editor'
  | 'reel-editor'
  | 'content-writer'
  | 'technical-writer'
  | 'resume-writer'
  | 'assignment-helper'
  | 'ppt-maker'
  | 'research-assistant';

export type ClientType = 
  | 'startup-founder'
  | 'small-business-owner'
  | 'agency-owner'
  | 'marketing-manager'
  | 'hr-manager'
  | 'individual-client';

export const SERVICE_CATEGORIES: Record<ServiceCategory, { label: string; group: string }> = {
  'frontend-developer': { label: 'Frontend Developer', group: 'Web Development' },
  'backend-developer': { label: 'Backend Developer', group: 'Web Development' },
  'fullstack-developer': { label: 'Full Stack Developer', group: 'Web Development' },
  'android-developer': { label: 'Android Developer', group: 'App Development' },
  'ios-developer': { label: 'iOS Developer', group: 'App Development' },
  'cross-platform-developer': { label: 'Cross-platform Developer', group: 'App Development' },
  'graphic-designer': { label: 'Graphic Designer', group: 'Design & Creative' },
  'poster-banner-designer': { label: 'Poster / Banner Designer', group: 'Design & Creative' },
  'ui-ux-designer': { label: 'UI/UX Designer', group: 'Design & Creative' },
  'video-editor': { label: 'Video Editor', group: 'Editing & Media' },
  'photo-editor': { label: 'Photo Editor', group: 'Editing & Media' },
  'reel-editor': { label: 'Reel / Short-form Editor', group: 'Editing & Media' },
  'content-writer': { label: 'Content Writer', group: 'Writing & Documentation' },
  'technical-writer': { label: 'Technical Writer', group: 'Writing & Documentation' },
  'resume-writer': { label: 'Resume Writer', group: 'Writing & Documentation' },
  'assignment-helper': { label: 'Assignment Helper', group: 'Academic & Homework Help' },
  'ppt-maker': { label: 'PPT Maker', group: 'Academic & Homework Help' },
  'research-assistant': { label: 'Research Assistant', group: 'Academic & Homework Help' },
};

export const CLIENT_TYPES: Record<ClientType, string> = {
  'startup-founder': 'Startup Founder',
  'small-business-owner': 'Small Business Owner',
  'agency-owner': 'Agency Owner',
  'marketing-manager': 'Marketing Manager',
  'hr-manager': 'HR / Hiring Manager',
  'individual-client': 'Individual Client',
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  skills?: string[];
  serviceCategories?: ServiceCategory[];
  clientType?: ClientType;
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
  assigneeRole?: 'freelancer';
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
  userRole: 'freelancer';
  workSummary: string;
  evidenceUrl: string;
  clientApproval: boolean;
  clientName: string;
  timestamp: Date;
  verified: boolean;
  publicLink: string;
}
