import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Lock,
  Briefcase,
  User,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">ContractIQ ProofPay</span>
          </div>
          <Link
            to="/auth"
            className="btn-gradient px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Lock className="w-4 h-4" />
            Payment Protection for Freelancers
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Lock expectations.
            <br />
            <span className="gradient-text">Protect payments.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            ContractIQ ProofPay prevents payment disputes by requiring evidence 
            for pre-agreed acceptance criteria before invoicing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="btn-gradient px-8 py-4 rounded-xl text-base font-medium flex items-center justify-center gap-2"
            >
              Start Free Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-xl border border-border bg-card hover:bg-secondary text-foreground font-medium transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A simple, transparent workflow that protects both freelancers and clients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              icon={FileText}
              title="Define Criteria"
              description="Agree on clear acceptance criteria before work begins. No ambiguity, no surprises."
            />
            <StepCard
              step={2}
              icon={Upload}
              title="Submit Evidence"
              description="Upload proof for each criterion. The system tracks what's verified."
            />
            <StepCard
              step={3}
              icon={CheckCircle2}
              title="Get Paid Fairly"
              description="Client reviews evidence and approves payment. Disputes are rare when criteria are clear."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why ProofPay?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built specifically for the freelancer-client relationship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Lock}
              title="Locked Expectations"
              description="Acceptance criteria are agreed upon upfront and cannot be changed mid-project."
            />
            <FeatureCard
              icon={Shield}
              title="Evidence Required"
              description="No invoice generation without documented proof for every criterion."
            />
            <FeatureCard
              icon={Zap}
              title="Clear Decisions"
              description="Clients can only approve or dispute—with full visibility into evidence."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Fair Resolution"
              description="When disputes happen, both parties have documentation to support their case."
            />
          </div>
        </div>
      </section>

      {/* For Who */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Built For</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="card-elevated p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Freelancers</h3>
              <p className="text-muted-foreground">
                Stop chasing payments. With ProofPay, you have documented evidence 
                that you delivered what was agreed upon. Get paid for what you actually did.
              </p>
            </div>
            <div className="card-elevated p-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Clients</h3>
              <p className="text-muted-foreground">
                Know exactly what you're paying for. Review evidence against 
                agreed criteria before approving payment. No more unclear deliverables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to protect your payments?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join the demo to see how ContractIQ ProofPay prevents payment disputes 
            before they happen.
          </p>
          <Link
            to="/auth"
            className="inline-flex btn-gradient px-10 py-4 rounded-xl text-lg font-medium items-center gap-3"
          >
            Try Demo Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">ContractIQ ProofPay</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 ContractIQ. Demo version for hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface StepCardProps {
  step: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

const StepCard = ({ step, icon: Icon, title, description }: StepCardProps) => (
  <div className="card-elevated p-6 text-center relative">
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
      {step}
    </div>
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="flex gap-4 p-6 rounded-xl bg-card border border-border">
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default LandingPage;
