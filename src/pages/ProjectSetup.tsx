import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Share2, 
  Clock, 
  CheckCircle2,
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AcceptanceCriterion, Milestone } from '@/lib/types';
import AppLayout from '@/components/AppLayout';

const ProjectSetup = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  
  const [projectName, setProjectName] = useState('Backend API Development');
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: 'ms-001',
      title: 'JWT Authentication API',
      amount: 5000,
      status: 'awaiting_agreement',
      criteria: [
        { id: 'c1', text: 'JWT authentication implemented', status: 'pending' },
        { id: 'c2', text: 'Handles ≥ 3,000 requests/min', status: 'pending' },
        { id: 'c3', text: 'Error rate < 2%', status: 'pending' },
      ],
    },
  ]);

  const addCriterion = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              criteria: [
                ...m.criteria,
                { id: `c-${Date.now()}`, text: '', status: 'pending' as const },
              ],
            }
          : m
      )
    );
  };

  const updateCriterion = (milestoneId: string, criterionId: string, text: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              criteria: m.criteria.map((c) =>
                c.id === criterionId ? { ...c, text } : c
              ),
            }
          : m
      )
    );
  };

  const removeCriterion = (milestoneId: string, criterionId: string) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? {
              ...m,
              criteria: m.criteria.filter((c) => c.id !== criterionId),
            }
          : m
      )
    );
  };

  const handleShare = () => {
    navigate('/submit-evidence');
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Setup</h1>
              <p className="text-muted-foreground text-sm">
                Define acceptance criteria before starting work.
              </p>
            </div>
          </div>
        </div>

        {/* Project Name */}
        <div className="card-elevated p-6 mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="input-field w-full text-lg font-medium"
            placeholder="Enter project name..."
          />
        </div>

        {/* Milestones */}
        {milestones.map((milestone) => (
          <div key={milestone.id} className="card-elevated p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) =>
                    setMilestones((prev) =>
                      prev.map((m) =>
                        m.id === milestone.id ? { ...m, title: e.target.value } : m
                      )
                    )
                  }
                  className="text-lg font-semibold text-foreground bg-transparent border-none outline-none w-full"
                  placeholder="Milestone title..."
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
                <Clock className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs font-medium text-warning">
                  Awaiting Client Agreement
                </span>
              </div>
            </div>

            {/* Acceptance Criteria */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                Acceptance Criteria
              </h3>
              <div className="space-y-3">
                {milestone.criteria.map((criterion, idx) => (
                  <div key={criterion.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {idx + 1}
                    </div>
                    <input
                      type="text"
                      value={criterion.text}
                      onChange={(e) =>
                        updateCriterion(milestone.id, criterion.id, e.target.value)
                      }
                      className="input-field flex-1"
                      placeholder="Enter acceptance criterion..."
                    />
                    <button
                      onClick={() => removeCriterion(milestone.id, criterion.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => addCriterion(milestone.id)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium mt-4 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Criterion
              </button>
            </div>

            {/* Payment Amount */}
            <div className="pt-4 border-t border-border">
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Amount
              </label>
              <div className="relative w-48">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) =>
                    setMilestones((prev) =>
                      prev.map((m) =>
                        m.id === milestone.id
                          ? { ...m, amount: parseInt(e.target.value) || 0 }
                          : m
                      )
                    )
                  }
                  className="input-field w-full pl-9"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full btn-gradient py-4 rounded-xl flex items-center justify-center gap-3 text-base font-medium"
        >
          <Share2 className="w-5 h-5" />
          Share Contract with Client
          <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Client will receive a link to review and agree to these terms
        </p>
      </div>
    </AppLayout>
  );
};

export default ProjectSetup;
