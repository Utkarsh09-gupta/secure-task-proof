import { create } from 'zustand';
import { User, Task, ProofCard, UserRole } from './types';

interface AppState {
  user: User | null;
  tasks: Task[];
  proofCards: ProofCard[];
  allUsers: User[];
  
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: UserRole, name?: string) => void;
  logout: () => void;
  
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  acceptTask: (taskId: string, assigneeId: string, assigneeRole: 'freelancer' | 'student') => void;
  submitMilestone: (taskId: string, milestoneId: string, url: string, note: string) => void;
  approveMilestone: (taskId: string, milestoneId: string) => void;
  requestRevision: (taskId: string, milestoneId: string) => void;
  
  addProofCard: (proofCard: ProofCard) => void;
  getProofCardsForUser: (userId: string) => ProofCard[];
}

// Demo users
const demoUsers: User[] = [
  { id: 'client-001', name: 'Sarah Mitchell', email: 'sarah@company.com', role: 'client', completedTasks: 12, paymentBehavior: 'on-time' },
  { id: 'freelancer-001', name: 'Alex Chen', email: 'alex@email.com', role: 'freelancer', skills: ['React', 'Node.js', 'UI/UX'] },
  { id: 'student-001', name: 'Priya Sharma', email: 'priya@university.edu', role: 'student', skills: ['Research', 'Writing', 'PowerPoint'] },
];

// Demo task
const demoTask: Task = {
  id: 'task-001',
  title: 'E-commerce Dashboard Design',
  description: 'Design and develop a modern dashboard for an e-commerce platform with analytics, order management, and customer insights.',
  totalAmount: 15000,
  clientId: 'client-001',
  assigneeId: 'freelancer-001',
  assigneeRole: 'freelancer',
  status: 'in_progress',
  paymentStatus: 'pending',
  createdAt: new Date(),
  contractLocked: true,
  milestones: [
    {
      id: 'ms-001',
      title: 'UI/UX Wireframes',
      amount: 5000,
      status: 'approved',
      revisionCount: 0,
      submissionUrl: 'https://figma.com/wireframes',
      submissionNote: 'Complete wireframes for all 8 screens',
      deliverables: [
        { id: 'd1', title: 'Dashboard wireframe', completed: true },
        { id: 'd2', title: 'Orders page wireframe', completed: true },
        { id: 'd3', title: 'Analytics wireframe', completed: true },
      ],
    },
    {
      id: 'ms-002',
      title: 'High-Fidelity Designs',
      amount: 5000,
      status: 'in_progress',
      revisionCount: 0,
      deliverables: [
        { id: 'd4', title: 'Final dashboard design', completed: false },
        { id: 'd5', title: 'Design system documentation', completed: false },
      ],
    },
    {
      id: 'ms-003',
      title: 'React Implementation',
      amount: 5000,
      status: 'pending',
      revisionCount: 0,
      deliverables: [
        { id: 'd6', title: 'Working React components', completed: false },
        { id: 'd7', title: 'Responsive implementation', completed: false },
      ],
    },
  ],
};

// Demo proof card
const demoProofCard: ProofCard = {
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
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  tasks: [demoTask],
  proofCards: [demoProofCard],
  allUsers: demoUsers,
  
  setUser: (user) => set({ user }),
  
  login: (email, password, role, name) => {
    const existingUser = demoUsers.find(u => u.role === role);
    const user: User = {
      id: existingUser?.id || `${role}-${Date.now()}`,
      name: name || existingUser?.name || 'Demo User',
      email,
      role,
      skills: role === 'freelancer' ? ['React', 'Node.js', 'UI/UX'] : role === 'student' ? ['Research', 'Writing'] : undefined,
      completedTasks: role === 'client' ? 12 : undefined,
      paymentBehavior: role === 'client' ? 'on-time' : undefined,
    };
    set({ user });
  },
  
  logout: () => set({ user: null }),
  
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t),
  })),
  
  acceptTask: (taskId, assigneeId, assigneeRole) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId 
        ? { ...t, assigneeId, assigneeRole, status: 'accepted' as const, contractLocked: true }
        : t
    ),
  })),
  
  submitMilestone: (taskId, milestoneId, url, note) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId 
        ? {
            ...t,
            milestones: t.milestones.map((m) =>
              m.id === milestoneId
                ? { ...m, status: 'submitted' as const, submissionUrl: url, submissionNote: note }
                : m
            ),
          }
        : t
    ),
  })),
  
  approveMilestone: (taskId, milestoneId) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    const milestone = task?.milestones.find(m => m.id === milestoneId);
    
    if (task && milestone) {
      // Create proof card
      const proofCard: ProofCard = {
        id: `proof-${Date.now()}`,
        taskId,
        taskTitle: task.title,
        milestoneTitle: milestone.title,
        userRole: task.assigneeRole || 'freelancer',
        workSummary: milestone.submissionNote || 'Work completed successfully',
        evidenceUrl: milestone.submissionUrl || '',
        clientApproval: true,
        clientName: state.allUsers.find(u => u.id === task.clientId)?.name || 'Client',
        timestamp: new Date(),
        verified: true,
        publicLink: `https://nexa.app/proof/${Date.now().toString(36)}`,
      };
      
      set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === taskId 
            ? {
                ...t,
                milestones: t.milestones.map((m) =>
                  m.id === milestoneId
                    ? { ...m, status: 'approved' as const }
                    : m
                ),
              }
            : t
        ),
        proofCards: [...state.proofCards, proofCard],
      }));
    }
  },
  
  requestRevision: (taskId, milestoneId) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === taskId 
        ? {
            ...t,
            milestones: t.milestones.map((m) =>
              m.id === milestoneId
                ? { ...m, status: 'revision_requested' as const, revisionCount: m.revisionCount + 1 }
                : m
            ),
          }
        : t
    ),
  })),
  
  addProofCard: (proofCard) => set((state) => ({ 
    proofCards: [...state.proofCards, proofCard] 
  })),
  
  getProofCardsForUser: (userId) => {
    const state = get();
    return state.proofCards.filter((p) => {
      const task = state.tasks.find(t => t.id === p.taskId);
      return task?.assigneeId === userId;
    });
  },
}));
