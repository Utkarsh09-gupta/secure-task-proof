import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user, tasks, submitMilestone, allUsers } = useAppStore();
  
  const task = tasks.find(t => t.id === taskId);
  const client = allUsers.find(u => u.id === task?.clientId);

  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>(null);

  if (!task) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Task not found</p>
          <Link to="/dashboard" className="text-primary font-semibold mt-2 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (milestoneId: string) => {
    if (submissionUrl.trim()) {
      submitMilestone(task.id, milestoneId, submissionUrl.trim(), submissionNote.trim());
      setSubmissionUrl('');
      setSubmissionNote('');
      setActiveMilestoneId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { icon: React.ElementType; label: string; className: string }> = {
      pending: { icon: Clock, label: 'Pending', className: 'bg-muted text-muted-foreground' },
      in_progress: { icon: Upload, label: 'In Progress', className: 'bg-primary/10 text-primary' },
      submitted: { icon: Clock, label: 'Submitted', className: 'status-pending' },
      approved: { icon: CheckCircle2, label: 'Approved', className: 'status-approved' },
      revision_requested: { icon: AlertCircle, label: 'Revision Needed', className: 'bg-destructive/10 text-destructive' },
    };
    return configs[status] || configs.pending;
  };

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

        {/* Task Info */}
        <div className="card-nexa p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Client</p>
              <Link to={`/profile/${client?.id}`} className="font-semibold text-primary hover:underline block">
                {client?.name || 'Unknown'}
              </Link>
              {client?.email && (
                <a href={`mailto:${client.email}`} className="text-xs text-muted-foreground hover:text-primary block mt-0.5">
                  {client.email}
                </a>
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
              <div className="flex items-center gap-1 font-bold text-foreground">
                <IndianRupee className="w-4 h-4" />
                {task.totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
              <span className={`text-sm font-semibold ${
                task.paymentStatus === 'paid' ? 'text-success' : 'text-muted-foreground'
              }`}>
                {task.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Contract</p>
              <div className="flex items-center gap-1 text-sm text-success font-semibold">
                <Lock className="w-3 h-3" />
                Locked
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <h2 className="text-lg font-bold text-foreground mb-4">Milestones</h2>
        <div className="space-y-4">
          {task.milestones.map((milestone, index) => {
            const statusConfig = getStatusConfig(milestone.status);
            const StatusIcon = statusConfig.icon;
            const canSubmit = milestone.status === 'pending' || milestone.status === 'in_progress' || milestone.status === 'revision_requested';
            const isActive = activeMilestoneId === milestone.id;

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
                            d.completed ? 'border-success bg-success' : 'border-border'
                          }`}>
                            {d.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                          <span className={d.completed ? 'text-muted-foreground line-through' : 'text-foreground'}>
                            {d.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revision Warning */}
                  {milestone.status === 'revision_requested' && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 mb-4">
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">
                        Client requested revision ({milestone.revisionCount}/2 used)
                      </p>
                    </div>
                  )}

                  {/* Submitted Evidence */}
                  {milestone.submissionUrl && milestone.status !== 'revision_requested' && (
                    <div className="p-3 rounded-xl bg-secondary/50 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Submitted Evidence</p>
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
                        <p className="text-sm text-muted-foreground mt-1">{milestone.submissionNote}</p>
                      )}
                    </div>
                  )}

                  {/* Submit Button */}
                  {canSubmit && !isActive && (
                    <button
                      onClick={() => setActiveMilestoneId(milestone.id)}
                      className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Submit Work
                    </button>
                  )}

                  {/* Submission Form */}
                  {isActive && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Evidence URL
                        </label>
                        <input
                          type="url"
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="input-nexa w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-1.5">
                          Note (optional)
                        </label>
                        <textarea
                          value={submissionNote}
                          onChange={(e) => setSubmissionNote(e.target.value)}
                          placeholder="Describe what you've delivered..."
                          className="input-nexa w-full h-20 resize-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setActiveMilestoneId(null)}
                          className="btn-secondary px-4 py-2 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmit(milestone.id)}
                          disabled={!submissionUrl.trim()}
                          className="btn-primary px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                          Submit
                        </button>
                      </div>
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

export default TaskDetail;
