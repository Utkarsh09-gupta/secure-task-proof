import { Link } from 'react-router-dom';
import { 
  User, 
  CheckCircle2, 
  Award,
  Clock,
  Wallet,
  ExternalLink
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';

const Profile = () => {
  const { user, tasks, proofCards } = useAppStore();

  if (!user) return null;

  const isClient = user.role === 'client';
  
  const userTasks = isClient
    ? tasks.filter(t => t.clientId === user.id)
    : tasks.filter(t => t.assigneeId === user.id);
  
  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  
  const userProofCards = proofCards.filter(p => {
    const task = tasks.find(t => t.id === p.taskId);
    return task?.assigneeId === user.id;
  });

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Profile Header */}
        <div className="card-nexa p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                <span className="verified-badge">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified on Nexa
                </span>
              </div>
              <p className="text-muted-foreground capitalize mb-4">{user.role}</p>
              
              {/* Skills for Freelancer/Student */}
              {user.skills && (
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Client-specific info */}
              {isClient && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user.completedTasks || completedTasks} tasks completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-success" />
                    <span className="text-success font-medium">On-time approvals</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-nexa p-5 text-center">
            <p className="text-2xl font-bold text-foreground">{userTasks.length}</p>
            <p className="text-sm text-muted-foreground">{isClient ? 'Tasks Posted' : 'Tasks Taken'}</p>
          </div>
          <div className="card-nexa p-5 text-center">
            <p className="text-2xl font-bold text-foreground">{completedTasks}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          {!isClient && (
            <div className="card-nexa p-5 text-center">
              <p className="text-2xl font-bold text-foreground">{userProofCards.length}</p>
              <p className="text-sm text-muted-foreground">Proof Cards</p>
            </div>
          )}
          {isClient && (
            <div className="card-nexa p-5 text-center">
              <p className="text-2xl font-bold text-success">100%</p>
              <p className="text-sm text-muted-foreground">On-time Rate</p>
            </div>
          )}
        </div>

        {/* Proof Wallet Preview (for Freelancer/Student) */}
        {!isClient && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Proof Wallet
              </h2>
              <Link
                to="/proof-wallet"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {userProofCards.length === 0 ? (
              <div className="card-nexa p-8 text-center">
                <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No proof cards yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {userProofCards.slice(0, 3).map((proof) => (
                  <div key={proof.id} className="proof-card">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{proof.taskTitle}</h3>
                        <p className="text-sm text-muted-foreground">{proof.milestoneTitle}</p>
                      </div>
                      <div className="verified-badge">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Approved by {proof.clientName}
                      </span>
                      <a
                        href={proof.evidenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
