import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  ExternalLink,
  IndianRupee,
  Shield,
  Clock
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

const ClientReview = () => {
  const navigate = useNavigate();
  const { projects, invoices, updateInvoice } = useAppStore();
  
  const project = projects[0];
  const milestone = project?.milestones[0];
  const invoice = invoices[0];

  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'approved' | 'disputed'>(
    invoice?.status || 'pending'
  );

  const handleApprove = () => {
    if (invoice) {
      updateInvoice(invoice.id, { status: 'approved' });
    }
    setPaymentStatus('approved');
  };

  const handleDispute = () => {
    if (invoice) {
      updateInvoice(invoice.id, { status: 'disputed' });
    }
    setPaymentStatus('disputed');
  };

  const criteria = milestone?.criteria || [];

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Client Review</h1>
              <p className="text-muted-foreground text-sm">
                Review submitted evidence and approve payment.
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Invoice</p>
              <p className="text-lg font-semibold text-foreground">
                #{invoice?.id || 'INV-001'}
              </p>
            </div>
            <PaymentStatusBadge status={paymentStatus} />
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Project</p>
              <p className="font-medium text-foreground">{project?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Milestone</p>
              <p className="font-medium text-foreground">{milestone?.title}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">Amount Due</span>
            <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
              <IndianRupee className="w-5 h-5" />
              {milestone?.amount.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Evidence Summary */}
        <div className="card-elevated p-6 mb-6">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Evidence Summary
          </h3>

          <div className="space-y-3">
            {criteria.map((criterion, idx) => (
              <div
                key={criterion.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50"
              >
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {idx + 1}. {criterion.text}
                  </p>
                  {criterion.evidenceUrl && (
                    <a
                      href={criterion.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Evidence
                    </a>
                  )}
                </div>
                <div className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  Verified
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/10 mb-6">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            All acceptance criteria agreed at project start have submitted evidence.
          </p>
        </div>

        {/* Action Buttons */}
        {paymentStatus === 'pending' && (
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              className="flex-1 btn-gradient py-4 rounded-xl flex items-center justify-center gap-2 text-base font-medium"
            >
              <CheckCircle2 className="w-5 h-5" />
              Approve Payment
            </button>
            <button
              onClick={handleDispute}
              className="flex-1 py-4 rounded-xl border-2 border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2 text-base font-medium"
            >
              <AlertTriangle className="w-5 h-5" />
              Raise Dispute
            </button>
          </div>
        )}

        {/* Success/Dispute Message */}
        {paymentStatus === 'approved' && (
          <div className="p-6 rounded-xl bg-accent/10 border border-accent/20 text-center">
            <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Payment Approved!
            </h3>
            <p className="text-sm text-muted-foreground">
              The freelancer has been notified. Payment is now due.
            </p>
          </div>
        )}

        {paymentStatus === 'disputed' && (
          <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Dispute Raised
            </h3>
            <p className="text-sm text-muted-foreground">
              The dispute has been logged. Both parties will be contacted for resolution.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

const PaymentStatusBadge = ({ status }: { status: 'pending' | 'approved' | 'disputed' }) => {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending',
      className: 'bg-warning/10 text-warning border-warning/20',
    },
    approved: {
      icon: CheckCircle2,
      label: 'Approved',
      className: 'bg-accent/10 text-accent border-accent/20',
    },
    disputed: {
      icon: AlertTriangle,
      label: 'Disputed',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${className}`}>
      <Icon className="w-4 h-4" />
      {label}
    </div>
  );
};

export default ClientReview;
