import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Upload,
  Wallet,
  ArrowRight,
  IndianRupee,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';

const FreelancerDashboard = () => {
  const { user, tasks, proofCards } = useAppStore();
  
  const myTasks = tasks.filter(t => t.assigneeId === user?.id);
  const activeTasks = myTasks.filter(t => t.status !== 'completed');
  const userProofCards = proofCards.filter(p => {
    const task = tasks.find(t => t.id === p.taskId);
    return task?.assigneeId === user?.id;
  });

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'Campus Proof Program • Build your verified credentials'
              : 'Manage your tasks and build verified proof of work'
            }
          </p>
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
            icon={CheckCircle2}
            label="Completed"
            value={myTasks.filter(t => t.status === 'completed').length}
            color="success"
          />
          <StatCard
            icon={Wallet}
            label="Proof Cards"
            value={userProofCards.length}
            color="accent"
          />
          <StatCard
            icon={IndianRupee}
            label="Earned"
            value={`₹${userProofCards.reduce((acc, p) => {
              const task = tasks.find(t => t.id === p.taskId);
              const milestone = task?.milestones.find(m => m.title === p.milestoneTitle);
              return acc + (milestone?.amount || 0);
            }, 0).toLocaleString('en-IN')}`}
            color="primary"
          />
        </div>

        {/* Active Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Active Tasks</h2>
          </div>

          {activeTasks.length === 0 ? (
            <div className="card-nexa p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No active tasks yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Proof Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Recent Proof Cards</h2>
            <Link
              to="/proof-wallet"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {userProofCards.length === 0 ? (
            <div className="card-nexa p-8 text-center">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Complete tasks to earn proof cards</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {userProofCards.slice(0, 2).map((proof) => (
                <ProofCardPreview key={proof.id} proof={proof} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: 'primary' | 'success' | 'accent';
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent/10 text-accent',
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

import { Task, ProofCard } from '@/lib/types';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const completedMilestones = task.milestones.filter(m => m.status === 'approved').length;
  const totalMilestones = task.milestones.length;
  const currentMilestone = task.milestones.find(m => m.status !== 'approved');

  return (
    <Link to={`/task/${task.id}`} className="block">
      <div className="card-interactive p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-foreground mb-1">{task.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <IndianRupee className="w-3 h-3" />
            {task.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-full bg-secondary rounded-full h-2 w-24">
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
          
          {currentMilestone && (
            <div className="flex items-center gap-2 text-sm">
              {currentMilestone.status === 'submitted' && (
                <span className="px-2.5 py-1 rounded-full status-pending text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Awaiting Review
                </span>
              )}
              {currentMilestone.status === 'revision_requested' && (
                <span className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Revision Needed
                </span>
              )}
              {(currentMilestone.status === 'pending' || currentMilestone.status === 'in_progress') && (
                <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-medium flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Ready to Submit
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

interface ProofCardPreviewProps {
  proof: ProofCard;
}

const ProofCardPreview = ({ proof }: ProofCardPreviewProps) => (
  <div className="proof-card">
    <div className="flex items-start justify-between mb-3">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Task</p>
        <h3 className="font-bold text-foreground">{proof.taskTitle}</h3>
      </div>
      <div className="verified-badge">
        <CheckCircle2 className="w-3 h-3" />
        Verified
      </div>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{proof.milestoneTitle}</p>
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Approved by {proof.clientName}</span>
      <span>{proof.timestamp.toLocaleDateString()}</span>
    </div>
  </div>
);

export default FreelancerDashboard;
