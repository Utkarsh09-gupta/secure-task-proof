import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  ExternalLink,
  AlertTriangle,
  User,
  Mail
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';

const TaskReview = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, approveMilestone, requestRevision, updateTask, allUsers } = useAppStore();
  
  const task = tasks.find(t => t.id === taskId);
  const assignee = allUsers.find(u => u.id === task?.assigneeId);

  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Task not found</p>
          <Link to="/dashboard/client" className="text-primary font-semibold mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleApprove = (milestoneId: string) => {
    approveMilestone(task.id, milestoneId);
  };

  const handleRequestRevision = (milestoneId: string) => {
    const milestone = task.milestones.find(m => m.id === milestoneId);
    if (milestone && milestone.revisionCount < 2) {
      requestRevision(task.id, milestoneId);
    }
  };

  const handleMarkPaid = () => {
    updateTask(task.id, { paymentStatus: 'paid' });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; label: string; className: string }> = {
      pending: { icon: Clock, label: 'Pending', className: 'bg-muted text-muted-foreground' },
      in_progress: { icon: Clock, label: 'In Progress', className: 'bg-primary/10 text-primary' },
      submitted: { icon: Clock, label: 'Awaiting Review', className: 'status-pending' },
      approved: { icon: CheckCircle2, label: 'Approved', className: 'status-approved' },
      revision_requested: { icon: AlertCircle, label: 'Revision Requested', className: 'bg-destructive/10 text-destructive' },
    };
    return configs[status] || configs.pending;
  };

  const allApproved = task.milestones.every(m => m.status === 'approved');

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-secondary text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
            <p className="text-muted-foreground">{task.description}</p>
          </div>
        </div>

        {/* Assignee Info */}
        {assignee && (
          <div className="card-nexa p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {assignee.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground">{assignee.name}</h3>
                  <span className="verified-badge">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified on Nexa
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-0.5">
                  <span className="capitalize">{assignee.role}</span>
                  {assignee.email && (
                    <a href={`mailto:${assignee.email}`} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {assignee.email}
                    </a>
                  )}
                </div>
              </div>
              <Link
                to={`/profile/${assignee.id}`}
                className="btn-secondary px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
            </div>
            {assignee.skills && (
              <div className="flex flex-wrap gap-2 mt-4">
                {assignee.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment Section */}
        <div className="card-nexa p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
                <IndianRupee className="w-5 h-5" />
                {task.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                task.paymentStatus === 'paid' ? 'status-approved' : 'status-pending'
              }`}>
                {task.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
              </span>
              {allApproved && task.paymentStatus !== 'paid' && (
                <button
                  onClick={handleMarkPaid}
                  className="btn-primary px-4 py-2 rounded-lg text-sm"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <h2 className="text-lg font-bold text-foreground mb-4">Milestones</h2>
        <div className="space-y-4">
          {task.milestones.map((milestone, index) => {
            const statusConfig = getStatusConfig(milestone.status);
            const StatusIcon = statusConfig.icon;
            const canReview = milestone.status === 'submitted';
            const canRequestRevision = milestone.revisionCount < 2;

            return (
              <div key={milestone.id} className="card-nexa overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        <h3 className="font-bold text-foreground">{milestone.title}</h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <IndianRupee className="w-3 h-3" />
                        {milestone.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Deliverables</p>
                    <div className="space-y-1.5">
                      {milestone.deliverables.map((d) => (
                        <div key={d.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            milestone.status === 'approved' ? 'border-success bg-success' : 'border-border'
                          }`}>
                            {milestone.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-foreground">{d.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submission */}
                  {milestone.submissionUrl && (
                    <div className="p-4 rounded-xl bg-secondary/50 mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Submitted Evidence</p>
                      <a
                        href={milestone.submissionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Submission
                      </a>
                      {milestone.submissionNote && (
                        <p className="text-sm text-muted-foreground mt-2">{milestone.submissionNote}</p>
                      )}
                    </div>
                  )}

                  {/* Review Actions */}
                  {canReview && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(milestone.id)}
                        className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      {canRequestRevision && (
                        <button
                          onClick={() => handleRequestRevision(milestone.id)}
                          className="px-5 py-2.5 rounded-xl text-sm border-2 border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Request Revision ({2 - milestone.revisionCount} left)
                        </button>
                      )}
                    </div>
                  )}

                  {/* Approved State */}
                  {milestone.status === 'approved' && (
                    <div className="flex items-center gap-2 text-success text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Milestone approved • Proof card generated
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaskReview;
