import { Link, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  Award,
  Clock,
  Wallet,
  ExternalLink,
  Briefcase,
  Code,
  Palette,
  Video,
  FileText,
  Mail,
  Lock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SERVICE_CATEGORIES, CLIENT_TYPES } from '@/lib/types';
import DashboardLayout from '@/components/DashboardLayout';

const getServiceIcon = (group: string) => {
  switch (group) {
    case 'Web Development':
    case 'App Development':
      return Code;
    case 'Design & Creative':
      return Palette;
    case 'Editing & Media':
      return Video;
    default:
      return FileText;
  }
};

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser, tasks, proofCards, allUsers } = useAppStore();

  if (!currentUser) return null;

  const profileUser = userId && userId !== currentUser.id
    ? allUsers.find(u => u.id === userId)
    : currentUser;

  // Enforce visibility check
  const hasConnection = !userId || userId === currentUser.id || currentUser.role === 'admin' || tasks.some(t => 
    (t.clientId === currentUser.id && t.assigneeId === userId) ||
    (t.clientId === userId && t.assigneeId === currentUser.id)
  );

  if (!profileUser || !hasConnection) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Private Profile</h2>
          <p className="text-muted-foreground mb-6">
            Profile credentials and details are only visible to users with direct active task relationships.
          </p>
          <Link to="/dashboard" className="btn-primary px-5 py-2.5 rounded-xl text-sm">
            Back to Dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isClient = profileUser.role === 'client';
  
  const userTasks = isClient
    ? tasks.filter(t => t.clientId === profileUser.id)
    : tasks.filter(t => t.assigneeId === profileUser.id);
  
  const completedTasks = userTasks.filter(t => t.status === 'completed').length;
  
  const userProofCards = proofCards.filter(p => {
    const task = tasks.find(t => t.id === p.taskId);
    return task?.assigneeId === profileUser.id;
  });

  // Group services by category for freelancers
  const groupedServices = profileUser.serviceCategories?.reduce((acc, category) => {
    const service = SERVICE_CATEGORIES[category];
    if (!acc[service.group]) acc[service.group] = [];
    acc[service.group].push(service.label);
    return acc;
  }, {} as Record<string, string[]>) || {};

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Profile Header */}
        <div className="card-nexa p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
              {profileUser.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">{profileUser.name}</h1>
                <span className="verified-badge">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified on Nexa
                </span>
              </div>
              
              {/* Role Badge */}
              <div className="flex items-center gap-2 mb-2">
                {isClient ? (
                  <>
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profileUser.clientType ? CLIENT_TYPES[profileUser.clientType] : 'Client'}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground capitalize">Freelancer</span>
                )}
              </div>

              {/* Contact Email */}
              {profileUser.email && (
                <div className="flex items-center gap-2 mt-2 mb-4 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a 
                    href={`mailto:${profileUser.email}`} 
                    className="font-semibold text-primary hover:underline"
                  >
                    {profileUser.email}
                  </a>
                </div>
              )}
              
              {/* Service Categories for Freelancer */}
              {!isClient && Object.keys(groupedServices).length > 0 && (
                <div className="space-y-3">
                  {Object.entries(groupedServices).map(([group, services]) => {
                    const Icon = getServiceIcon(group);
                    return (
                      <div key={group}>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {group}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {services.map((service) => (
                            <span 
                              key={service} 
                              className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Skills for Freelancer */}
              {profileUser.skills && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full bg-secondary text-sm font-medium text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Client-specific info */}
              {isClient && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profileUser.completedTasks || completedTasks} projects completed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className={`w-4 h-4 ${profileUser.paymentBehavior === 'on-time' ? 'text-success' : 'text-warning'}`} />
                    <span className={`font-medium ${profileUser.paymentBehavior === 'on-time' ? 'text-success' : 'text-warning'}`}>
                      {profileUser.paymentBehavior === 'on-time' ? 'On-time approvals' : 'Occasional delays'}
                    </span>
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
              <p className="text-2xl font-bold text-success">
                {profileUser.paymentBehavior === 'on-time' ? '100%' : '85%'}
              </p>
              <p className="text-sm text-muted-foreground">On-time Rate</p>
            </div>
          )}
        </div>

        {/* Proof Wallet Preview (for Freelancer) */}
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
