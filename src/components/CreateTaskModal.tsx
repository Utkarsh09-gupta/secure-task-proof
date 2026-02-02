import { useState } from 'react';
import { X, Plus, Trash2, IndianRupee } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Task, Milestone, Deliverable } from '@/lib/types';

interface CreateTaskModalProps {
  onClose: () => void;
}

const CreateTaskModal = ({ onClose }: CreateTaskModalProps) => {
  const { user, addTask } = useAppStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState<Partial<Milestone>[]>([
    { title: '', amount: 0, deliverables: [{ id: '1', title: '', completed: false }] }
  ]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      { title: '', amount: 0, deliverables: [{ id: Date.now().toString(), title: '', completed: false }] }
    ]);
  };

  const updateMilestone = (index: number, field: string, value: string | number) => {
    setMilestones(prev => 
      prev.map((m, i) => i === index ? { ...m, [field]: value } : m)
    );
  };

  const addDeliverable = (milestoneIndex: number) => {
    setMilestones(prev =>
      prev.map((m, i) => 
        i === milestoneIndex 
          ? { ...m, deliverables: [...(m.deliverables || []), { id: Date.now().toString(), title: '', completed: false }] }
          : m
      )
    );
  };

  const updateDeliverable = (milestoneIndex: number, deliverableIndex: number, value: string) => {
    setMilestones(prev =>
      prev.map((m, i) => 
        i === milestoneIndex 
          ? {
              ...m,
              deliverables: m.deliverables?.map((d, j) =>
                j === deliverableIndex ? { ...d, title: value } : d
              )
            }
          : m
      )
    );
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const task: Task = {
      id: `task-${Date.now()}`,
      title,
      description,
      totalAmount: milestones.reduce((acc, m) => acc + (m.amount || 0), 0),
      clientId: user?.id || '',
      status: 'posted',
      paymentStatus: 'pending',
      createdAt: new Date(),
      contractLocked: false,
      milestones: milestones.map((m, i) => ({
        id: `ms-${Date.now()}-${i}`,
        title: m.title || '',
        amount: m.amount || 0,
        deliverables: m.deliverables || [],
        status: 'pending' as const,
        revisionCount: 0,
      })),
    };

    addTask(task);
    onClose();
  };

  const totalAmount = milestones.reduce((acc, m) => acc + (m.amount || 0), 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Task Details */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Task Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., E-commerce Dashboard Design"
                className="input-nexa w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the task requirements..."
                className="input-nexa w-full h-24 resize-none"
                required
              />
            </div>

            {/* Milestones */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Milestones
              </label>
              <div className="space-y-4">
                {milestones.map((milestone, mIndex) => (
                  <div key={mIndex} className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Milestone {mIndex + 1}
                      </span>
                      {milestones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMilestone(mIndex)}
                          className="p-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(mIndex, 'title', e.target.value)}
                          placeholder="Milestone title"
                          className="input-nexa w-full text-sm"
                          required
                        />
                      </div>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          value={milestone.amount || ''}
                          onChange={(e) => updateMilestone(mIndex, 'amount', parseInt(e.target.value) || 0)}
                          placeholder="Amount"
                          className="input-nexa w-full text-sm pl-9"
                          required
                        />
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-2">
                      <span className="text-xs text-muted-foreground">Deliverables</span>
                      {milestone.deliverables?.map((d, dIndex) => (
                        <input
                          key={d.id}
                          type="text"
                          value={d.title}
                          onChange={(e) => updateDeliverable(mIndex, dIndex, e.target.value)}
                          placeholder={`Deliverable ${dIndex + 1}`}
                          className="input-nexa w-full text-sm"
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => addDeliverable(mIndex)}
                        className="text-xs text-primary font-semibold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Deliverable
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMilestone}
                className="mt-3 text-sm text-primary font-semibold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Milestone
              </button>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
              <span className="font-semibold text-foreground">Total Amount</span>
              <div className="flex items-center gap-1 text-xl font-bold text-primary">
                <IndianRupee className="w-5 h-5" />
                {totalAmount.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary py-3 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3 rounded-xl"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
