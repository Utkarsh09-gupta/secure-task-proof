import { create } from 'zustand';
import { User, Project, Invoice, UserRole } from './types';

interface AppState {
  user: User | null;
  projects: Project[];
  invoices: Invoice[];
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: UserRole, name?: string) => void;
  logout: () => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoiceId: string, updates: Partial<Invoice>) => void;
}

// Demo data
const demoProject: Project = {
  id: 'proj-001',
  name: 'Backend API Development',
  clientId: 'client-001',
  freelancerId: 'freelancer-001',
  milestones: [
    {
      id: 'ms-001',
      title: 'JWT Authentication API',
      amount: 5000,
      status: 'in_progress',
      criteria: [
        { id: 'c1', text: 'JWT authentication implemented', status: 'pending' },
        { id: 'c2', text: 'Handles ≥ 3,000 requests/min', status: 'pending' },
        { id: 'c3', text: 'Error rate < 2%', status: 'pending' },
      ],
    },
  ],
  status: 'active',
  createdAt: new Date(),
};

export const useAppStore = create<AppState>((set) => ({
  user: null,
  projects: [demoProject],
  invoices: [],
  
  setUser: (user) => set({ user }),
  
  login: (email, password, role, name) => {
    const user: User = {
      id: role === 'freelancer' ? 'freelancer-001' : 'client-001',
      name: name || (role === 'freelancer' ? 'Alex Johnson' : 'Sarah Client'),
      email,
      role,
    };
    set({ user });
  },
  
  logout: () => set({ user: null }),
  
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project] 
  })),
  
  updateProject: (projectId, updates) => set((state) => ({
    projects: state.projects.map((p) => 
      p.id === projectId ? { ...p, ...updates } : p
    ),
  })),
  
  addInvoice: (invoice) => set((state) => ({ 
    invoices: [...state.invoices, invoice] 
  })),
  
  updateInvoice: (invoiceId, updates) => set((state) => ({
    invoices: state.invoices.map((i) => 
      i.id === invoiceId ? { ...i, ...updates } : i
    ),
  })),
}));
