import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  FileCheck, 
  Upload, 
  CheckCircle2, 
  Award,
  Users,
  Briefcase,
  Shield,
  ExternalLink,
  Wallet
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Nexa</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/auth?mode=login"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth?mode=signup"
              className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
            <Award className="w-4 h-4" />
            The Trust Platform for Work
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Turn work into
            <br />
            <span className="gradient-text">verified proof.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Nexa helps freelancers convert completed work into trusted, 
            shareable proof. Replace resumes with real outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth?mode=signup"
              className="btn-primary px-8 py-4 rounded-xl text-base flex items-center justify-center gap-2"
            >
              Start Building Your Proof
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary px-8 py-4 rounded-xl text-base"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How Nexa Works */}
      <section id="how-it-works" className="py-20 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How Nexa Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Simple, transparent, and proof-first.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StepCard
              step={1}
              icon={FileCheck}
              title="Create or Accept"
              description="Create a task or accept one from a client."
            />
            <StepCard
              step={2}
              icon={Upload}
              title="Submit Work"
              description="Upload your deliverables and evidence."
            />
            <StepCard
              step={3}
              icon={CheckCircle2}
              title="Client Approves"
              description="Client reviews and approves your work."
            />
            <StepCard
              step={4}
              icon={Award}
              title="Proof Generated"
              description="Verified proof card is created automatically."
            />
          </div>
        </div>
      </section>

      {/* Who Nexa Is For */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Who Nexa Is For</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PersonaCard
              icon={Users}
              title="Freelancers"
              description="Build a verified portfolio of completed work. Share proof instead of promises."
            />
            <PersonaCard
              icon={Briefcase}
              title="Clients & Employers"
              description="Verify real work history. See actual outcomes, not just claims."
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Key Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={FileCheck}
              title="Structured Tasks & Milestones"
              description="Break down work into clear milestones with defined deliverables."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Client Approvals"
              description="Built-in approval workflow with maximum 2 revisions per milestone."
            />
            <FeatureCard
              icon={Wallet}
              title="Proof Wallet"
              description="All your verified proof cards in one place, ready to share."
            />
            <FeatureCard
              icon={ExternalLink}
              title="Public Verification Links"
              description="Share proof with anyone via verified public links."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <span className="verified-badge">Verified on Nexa</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Start Building Your Proof Today
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of freelancers who trust Nexa to verify their work.
          </p>
          <Link
            to="/auth?mode=signup"
            className="inline-flex btn-primary px-10 py-4 rounded-xl text-lg items-center gap-3"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">Nexa</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Nexa. Turn work into verified proof.
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
  <div className="card-nexa p-6 text-center relative">
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
      {step}
    </div>
    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 mt-2">
      <Icon className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

interface PersonaCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const PersonaCard = ({ icon: Icon, title, description }: PersonaCardProps) => (
  <div className="card-interactive p-8 text-center">
    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="flex gap-4 p-6 rounded-2xl bg-card border border-border">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default LandingPage;
