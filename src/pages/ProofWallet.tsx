import { Link } from 'react-router-dom';
import { 
  Wallet, 
  CheckCircle2, 
  ExternalLink,
  Share2,
  Calendar,
  Award
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import DashboardLayout from '@/components/DashboardLayout';

const ProofWallet = () => {
  const { user, tasks, proofCards } = useAppStore();
  
  const userProofCards = proofCards.filter(p => {
    const task = tasks.find(t => t.id === p.taskId);
    return task?.assigneeId === user?.id;
  });

  const handleShare = (publicLink: string) => {
    navigator.clipboard.writeText(publicLink);
    // Could add a toast here
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Proof Wallet</h1>
            <p className="text-muted-foreground">
              Your verified work credentials
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="card-nexa p-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userProofCards.length}</p>
            <p className="text-sm text-muted-foreground">Total Proofs</p>
          </div>
          <div className="card-nexa p-5">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userProofCards.filter(p => p.verified).length}</p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </div>
          <div className="card-nexa p-5 md:col-span-1 col-span-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{userProofCards.length}</p>
            <p className="text-sm text-muted-foreground">Shareable Links</p>
          </div>
        </div>

        {/* Proof Cards */}
        {userProofCards.length === 0 ? (
          <div className="card-nexa p-12 text-center">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">No proof cards yet</h3>
            <p className="text-muted-foreground mb-6">
              Complete tasks and get client approval to earn verified proof cards.
            </p>
            <Link
              to="/dashboard"
              className="btn-primary px-6 py-3 rounded-xl inline-block"
            >
              View Your Tasks
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {userProofCards.map((proof) => (
              <ProofCardFull key={proof.id} proof={proof} onShare={handleShare} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

import { ProofCard } from '@/lib/types';

interface ProofCardFullProps {
  proof: ProofCard;
  onShare: (link: string) => void;
}

const ProofCardFull = ({ proof, onShare }: ProofCardFullProps) => (
  <div className="proof-card relative overflow-hidden">
    {/* Verified Badge */}
    <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
      <div className="absolute top-3 right-[-30px] w-[120px] bg-primary text-primary-foreground text-xs font-bold text-center py-1 rotate-45">
        VERIFIED
      </div>
    </div>

    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
          Proof of Work
        </p>
        <h3 className="text-lg font-bold text-foreground">{proof.taskTitle}</h3>
      </div>
    </div>

    <div className="space-y-4 mb-6">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Milestone</p>
        <p className="font-semibold text-foreground">{proof.milestoneTitle}</p>
      </div>
      
      <div>
        <p className="text-xs text-muted-foreground mb-1">Work Summary</p>
        <p className="text-sm text-foreground">{proof.workSummary}</p>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Role</p>
          <p className="text-sm font-semibold text-foreground capitalize">{proof.userRole}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Approved By</p>
          <p className="text-sm font-semibold text-foreground">{proof.clientName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        {proof.timestamp.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })}
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3 pt-4 border-t border-border">
      <a
        href={proof.evidenceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 btn-secondary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
      >
        <ExternalLink className="w-4 h-4" />
        View Evidence
      </a>
      <button
        onClick={() => onShare(proof.publicLink)}
        className="flex-1 btn-primary py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Proof
      </button>
    </div>

    {/* Verification Footer */}
    <div className="mt-4 pt-4 border-t border-primary/20 flex items-center justify-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-primary" />
      <span className="text-xs font-semibold text-primary">Verified on Nexa</span>
    </div>
  </div>
);

export default ProofWallet;
