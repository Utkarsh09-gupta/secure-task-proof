import { create } from 'zustand';
import { User, Task, ProofCard, UserRole, ServiceCategory, ClientType } from './types';
import { toast } from 'sonner';

interface AppState {
  user: User | null;
  tasks: Task[];
  proofCards: ProofCard[];
  allUsers: User[];
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string, role: UserRole, name?: string, serviceCategories?: ServiceCategory[], clientType?: ClientType) => Promise<boolean>;
  logout: () => void;
  
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'clientId' | 'status' | 'paymentStatus' | 'createdAt' | 'contractLocked'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  acceptTask: (taskId: string, assigneeId: string) => Promise<void>;
  submitMilestone: (taskId: string, milestoneId: string, url: string, note: string) => Promise<void>;
  approveMilestone: (taskId: string, milestoneId: string) => Promise<void>;
  requestRevision: (taskId: string, milestoneId: string) => Promise<void>;
  
  fetchProofCards: () => Promise<void>;
  addProofCard: (proofCard: ProofCard) => void;
  getProofCardsForUser: (userId: string) => ProofCard[];
  fetchAllUsers: () => Promise<void>;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('nexa_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  tasks: [],
  proofCards: [],
  allUsers: [],
  isLoading: false,
  
  setUser: (user) => set({ user }),

  checkAuth: async () => {
    const token = localStorage.getItem('nexa_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/me', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const user = await response.json();
        set({ user });
        // Fetch database data
        await get().fetchTasks();
        await get().fetchProofCards();
        await get().fetchAllUsers();
      } else {
        // Token expired or invalid
        localStorage.removeItem('nexa_token');
        set({ user: null });
      }
    } catch (error) {
      console.error('Check auth error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  login: async (email, password, role, name, serviceCategories, clientType) => {
    set({ isLoading: true });
    try {
      let response;
      const isSignup = !!name;

      if (isSignup) {
        // Derive some default skills from service categories if not explicitly set
        const defaultSkillsMap: Record<ServiceCategory, string[]> = {
          'frontend-developer': ['React', 'TypeScript', 'Tailwind CSS'],
          'backend-developer': ['Node.js', 'Express', 'SQL'],
          'fullstack-developer': ['React', 'Node.js', 'TypeScript', 'SQL'],
          'android-developer': ['Kotlin', 'Android SDK'],
          'ios-developer': ['Swift', 'iOS SDK'],
          'cross-platform-developer': ['Flutter', 'React Native'],
          'graphic-designer': ['Photoshop', 'Illustrator'],
          'poster-banner-designer': ['Photoshop', 'Canva'],
          'ui-ux-designer': ['Figma', 'Adobe XD'],
          'video-editor': ['Premiere Pro', 'After Effects'],
          'photo-editor': ['Lightroom', 'Photoshop'],
          'reel-editor': ['CapCut', 'Premiere Pro'],
          'content-writer': ['Copywriting', 'SEO'],
          'technical-writer': ['Markdown', 'API Documentation'],
          'resume-writer': ['Resume Writing', 'LinkedIn Optimization'],
          'assignment-helper': ['Academic Writing', 'Research'],
          'ppt-maker': ['PowerPoint', 'Keynote'],
          'research-assistant': ['Literature Review', 'Data Analysis']
        };

        const derivedSkills = serviceCategories && serviceCategories.length > 0 
          ? Array.from(new Set(serviceCategories.flatMap(cat => defaultSkillsMap[cat] || [])))
          : ['React', 'TypeScript'];

        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            role,
            name,
            serviceCategories,
            clientType,
            skills: derivedSkills
          })
        });
      } else {
        response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
      }

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Authentication failed');
        return false;
      }

      localStorage.setItem('nexa_token', data.token);
      set({ user: data.user });
      
      toast.success(isSignup ? 'Account created successfully!' : 'Logged in successfully!');
      
      // Load initial data
      await get().fetchTasks();
      await get().fetchProofCards();
      await get().fetchAllUsers();
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network connection error');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: () => {
    localStorage.removeItem('nexa_token');
    set({ user: null, tasks: [], proofCards: [], allUsers: [] });
    toast.success('Logged out successfully');
  },

  fetchTasks: async () => {
    try {
      const response = await fetch('/api/tasks', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const tasks = await response.json();
        // Parse database dates
        const formattedTasks = tasks.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        }));
        set({ tasks: formattedTasks });
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
    }
  },
  
  addTask: async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      
      if (response.ok) {
        const newTask = await response.json();
        newTask.createdAt = new Date(newTask.createdAt);
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        toast.success('Task created successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Add task error:', error);
      toast.error('Network error creating task');
    }
  },
  
  updateTask: async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        updatedTask.createdAt = new Date(updatedTask.createdAt);
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? updatedTask : t)
        }));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Update task error:', error);
    }
  },
  
  acceptTask: async (taskId, assigneeId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/accept`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        updatedTask.createdAt = new Date(updatedTask.createdAt);
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? updatedTask : t)
        }));
        toast.success('Task accepted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to accept task');
      }
    } catch (error) {
      console.error('Accept task error:', error);
      toast.error('Network error accepting task');
    }
  },
  
  submitMilestone: async (taskId, milestoneId, url, note) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/milestones/${milestoneId}/submit`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ submissionUrl: url, submissionNote: note })
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        updatedTask.createdAt = new Date(updatedTask.createdAt);
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? updatedTask : t)
        }));
        toast.success('Milestone submitted successfully!');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to submit milestone');
      }
    } catch (error) {
      console.error('Submit milestone error:', error);
      toast.error('Network error submitting milestone');
    }
  },
  
  approveMilestone: async (taskId, milestoneId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/milestones/${milestoneId}/approve`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        updatedTask.createdAt = new Date(updatedTask.createdAt);
        
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? updatedTask : t)
        }));
        
        toast.success('Milestone approved and Proof Card generated!');
        
        // Refresh proof cards list
        await get().fetchProofCards();
        // Refresh user details (since completedTasks may have incremented)
        await get().checkAuth();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to approve milestone');
      }
    } catch (error) {
      console.error('Approve milestone error:', error);
      toast.error('Network error approving milestone');
    }
  },
  
  requestRevision: async (taskId, milestoneId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/milestones/${milestoneId}/revision`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        updatedTask.createdAt = new Date(updatedTask.createdAt);
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? updatedTask : t)
        }));
        toast.success('Revision requested successfully.');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to request revision');
      }
    } catch (error) {
      console.error('Request revision error:', error);
      toast.error('Network error requesting revision');
    }
  },

  fetchProofCards: async () => {
    try {
      const response = await fetch('/api/proof', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const proofs = await response.json();
        const formattedProofs = proofs.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        }));
        set({ proofCards: formattedProofs });
      }
    } catch (error) {
      console.error('Fetch proof cards error:', error);
    }
  },
  
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

  fetchAllUsers: async () => {
    try {
      // Non-admins can't fetch all users directly from admin endpoint,
      // but we need assignee details on dashboard.
      // So we can fallback gracefully or handle user by user.
      // Let's call the users endpoint. If it's a freelancer/client they won't have admin access,
      // so we can fallback to fetching individual profiles of users involved in tasks.
      const token = localStorage.getItem('nexa_token');
      if (!token) return;

      const userRole = get().user?.role;
      if (userRole === 'admin') {
        const response = await fetch('/api/auth/users', { headers: getAuthHeaders() });
        if (response.ok) {
          const users = await response.json();
          set({ allUsers: users });
          return;
        }
      }

      // If client/freelancer, get users referenced in tasks
      const tasks = get().tasks;
      const userIds = new Set<string>();
      tasks.forEach(t => {
        if (t.clientId) userIds.add(t.clientId);
        if (t.assigneeId) userIds.add(t.assigneeId);
      });

      const fetchedUsers: User[] = [];
      for (const id of Array.from(userIds)) {
        try {
          const response = await fetch(`/api/auth/users/${id}`, { headers: getAuthHeaders() });
          if (response.ok) {
            const userDetail = await response.json();
            fetchedUsers.push(userDetail);
          }
        } catch (e) {
          console.error(`Error fetching user ${id}:`, e);
        }
      }

      set({ allUsers: fetchedUsers });
    } catch (error) {
      console.error('Fetch all users error:', error);
    }
  }
}));
