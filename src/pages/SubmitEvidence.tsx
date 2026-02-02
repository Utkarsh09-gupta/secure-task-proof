import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  Circle,
  FileText,
  ArrowRight,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AcceptanceCriterion, Milestone } from '@/lib/types';
import AppLayout from '@/components/AppLayout';

const SubmitEvidence = () => {
  const navigate = useNavigate();
  const { projects, updateProject, addInvoice } = useAppStore();
  
  const project = projects[0];
  const milestone = project?.milestones[0];

  const [criteria, setCriteria] = useState<AcceptanceCriterion[]>(
    milestone?.criteria || []
  );

  const allEvidenceSubmitted = criteria.every((c) => c.status === 'submitted');

  const updateEvidence = (criterionId: string, evidenceUrl: string, evidenceType: 'file' | 'link') => {
    setCriteria((prev) =>
      prev.map((c) =>
        c.id === criterionId
          ? { ...c, evidenceUrl, evidenceType, status: 'submitted' as const }
          : c
      )
    );
  };

  const handleGenerateInvoice = () => {
    if (!allEvidenceSubmitted) return;
    
    // Update project milestone status
    updateProject(project.id, {
      milestones: project.milestones.map((m) =>
        m.id === milestone.id ? { ...m, status: 'submitted' as const, criteria } : m
      ),
    });

    // Add invoice
    addInvoice({
      id: `inv-${Date.now()}`,
      projectId: project.id,
      milestoneId: milestone.id,
      amount: milestone.amount,
      status: 'pending',
      createdAt: new Date(),
    });

    navigate('/client-review');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Submit Work Evidence</h1>
              <p className="text-muted-foreground text-sm">
                Provide proof for each acceptance criterion.
              </p>
            </div>
          </div>
        </div>

        {/* Milestone Summary */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Project</p>
              <h2 className="text-lg font-semibold text-foreground">{project?.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Milestone</p>
              <p className="font-medium text-foreground">{milestone?.title}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Payment on Approval</span>
            <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
              <IndianRupee className="w-4 h-4" />
              {milestone?.amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Evidence Upload Section */}
        <div className="card-elevated p-6 mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Acceptance Criteria & Evidence
          </h3>

          <div className="space-y-4">
            {criteria.map((criterion, idx) => (
              <EvidenceItem
                key={criterion.id}
                index={idx + 1}
                criterion={criterion}
                onUpdateEvidence={(url, type) => updateEvidence(criterion.id, url, type)}
              />
            ))}
          </div>
        </div>

        {/* System Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            All acceptance criteria must have evidence before invoice generation.
          </p>
        </div>

        {/* Generate Invoice Button */}
        <button
          onClick={handleGenerateInvoice}
          disabled={!allEvidenceSubmitted}
          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-base font-medium transition-all ${
            allEvidenceSubmitted
              ? 'btn-gradient'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Generate Invoice
          <ArrowRight className="w-5 h-5" />
        </button>

        {!allEvidenceSubmitted && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            {criteria.filter((c) => c.status === 'submitted').length} of {criteria.length} criteria have evidence
          </p>
        )}
      </div>
    </AppLayout>
  );
};

interface EvidenceItemProps {
  index: number;
  criterion: AcceptanceCriterion;
  onUpdateEvidence: (url: string, type: 'file' | 'link') => void;
}

const EvidenceItem = ({ index, criterion, onUpdateEvidence }: EvidenceItemProps) => {
  const [inputType, setInputType] = useState<'file' | 'link'>('link');
  const [inputValue, setInputValue] = useState(criterion.evidenceUrl || '');

  const isSubmitted = criterion.status === 'submitted';

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onUpdateEvidence(inputValue.trim(), inputType);
    }
  };

  return (
    <div className={`p-4 rounded-xl border transition-colors ${
      isSubmitted 
        ? 'bg-accent/5 border-accent/20' 
        : 'bg-secondary/50 border-border'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        {isSubmitted ? (
          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <p className={`text-sm font-medium ${isSubmitted ? 'text-foreground' : 'text-foreground'}`}>
            {index}. {criterion.text}
          </p>
          {isSubmitted && criterion.evidenceUrl && (
            <p className="text-xs text-accent mt-1 flex items-center gap-1">
              <LinkIcon className="w-3 h-3" />
              Evidence submitted
            </p>
          )}
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          isSubmitted ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
        }`}>
          {isSubmitted ? 'Submitted' : 'Pending'}
        </div>
      </div>

      {!isSubmitted && (
        <div className="pl-8">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setInputType('link')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                inputType === 'link'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              Link
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                inputType === 'file'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <Upload className="w-3 h-3" />
              File
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type={inputType === 'link' ? 'url' : 'text'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputType === 'link' ? 'Paste evidence URL...' : 'Enter file name...'}
              className="input-field flex-1 text-sm py-2.5"
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitEvidence;
