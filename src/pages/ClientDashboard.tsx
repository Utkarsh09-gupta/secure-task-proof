import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Users,
  IndianRupee,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';
import CreateTaskModal from '@/components/CreateTaskModal';

const ClientDashboard = () => {
  const { user, tasks, allUsers } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const myTasks = tasks.filter(t => t.clientId === user?.id);
  const activeTasks = myTasks.filter(t => t.status !== 'completed');
  const pendingReview = myTasks.filter(t => 
    t.milestones.some(m => m.status === 'submitted')
  );

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground">
              Manage your projects and review submissions
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FileText}
            label="Active Tasks"
            value={activeTasks.length}
            color="primary"
          />
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={pendingReview.length}
            color="warning"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={myTasks.filter(t => t.status === 'completed').length}
            color="success"
          />
          <StatCard
            icon={IndianRupee}
            label="Total Paid"
            value={`₹${myTasks
              .filter(t => t.paymentStatus === 'paid')
              .reduce((acc, t) => acc + t.totalAmount, 0)
              .toLocaleString('en-IN')}`}
            color="primary"
          />
        </div>

        {/* Pending Reviews */}
        {pendingReview.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-bold text-foreground">Needs Your Review</h2>
            </div>
            <div className="space-y-4">
              {pendingReview.map((task) => (
                <ReviewTaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* All Tasks */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">All Tasks</h2>
          {myTasks.length === 0 ? (
            <div className="card-nexa p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No tasks created yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myTasks.map((task) => (
                <ClientTaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateTaskModal onClose={() => setShowCreateModal(false)} />
      )}
    </DashboardLayout>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'primary' | 'success' | 'warning';
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="card-nexa p-5">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

import { Task } from '@/lib/types';

interface ReviewTaskCardProps {
  task: Task;
}

const ReviewTaskCard = ({ task }: ReviewTaskCardProps) => {
  const submittedMilestone = task.milestones.find(m => m.status === 'submitted');
  
  return (
    <Link to={`/task/${task.id}/review`} className="block">
      <div className="card-nexa p-6 border-l-4 border-l-warning">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-foreground mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground">
              Milestone: {submittedMilestone?.title}
            </p>
          </div>
          <button className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Review
          </button>
        </div>
      </div>
    </Link>
  );
};

interface ClientTaskCardProps {
  task: Task;
}

const ClientTaskCard = ({ task }: ClientTaskCardProps) => {
  const completedMilestones = task.milestones.filter(m => m.status === 'approved').length;
  const totalMilestones = task.milestones.length;
  const { allUsers } = useAppStore();
  const assignee = allUsers.find(u => u.id === task.assigneeId);

  const statusConfig = {
    draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
    posted: { label: 'Posted', className: 'bg-primary/10 text-primary' },
    accepted: { label: 'Accepted', className: 'bg-success/10 text-success' },
    in_progress: { label: 'In Progress', className: 'bg-primary/10 text-primary' },
    completed: { label: 'Completed', className: 'bg-success/10 text-success' },
  };

  return (
    <Link to={`/task/${task.id}/review`} className="block">
      <div className="card-interactive p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-foreground">{task.title}</h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[task.status].className}`}>
                {statusConfig[task.status].label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-foreground">
              <IndianRupee className="w-4 h-4" />
              {task.totalAmount.toLocaleString('en-IN')}
            </div>
            <span className={`text-xs font-medium ${
              task.paymentStatus === 'paid' ? 'text-success' : 'text-muted-foreground'
            }`}>
              {task.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {assignee && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {assignee.name.charAt(0)}
                </div>
                <span className="text-sm text-muted-foreground">{assignee.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-24 bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(completedMilestones / totalMilestones) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {completedMilestones}/{totalMilestones}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClientDashboard;
