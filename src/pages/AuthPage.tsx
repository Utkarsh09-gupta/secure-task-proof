import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, User, Briefcase } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@proofpay.com');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<UserRole>('freelancer');
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role, name || undefined);
    navigate(role === 'freelancer' ? '/project-setup' : '/client-review');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">ContractIQ ProofPay</h1>
          <p className="text-muted-foreground mt-2">Lock expectations. Protect payments.</p>
        </div>

        {/* Auth Card */}
        <div className="card-elevated p-8">
          {/* Toggle */}
          <div className="flex bg-secondary rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                isLogin 
                  ? 'bg-card text-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                !isLogin 
                  ? 'bg-card text-foreground shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="input-field w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full"
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('freelancer')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    role === 'freelancer'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role === 'freelancer' ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    <User className={`w-5 h-5 ${
                      role === 'freelancer' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium text-sm ${
                      role === 'freelancer' ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      Freelancer
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 ${
                    role === 'client'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role === 'client' ? 'bg-primary/10' : 'bg-secondary'
                  }`}>
                    <Briefcase className={`w-5 h-5 ${
                      role === 'client' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium text-sm ${
                      role === 'client' ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      Client
                    </p>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gradient py-3 rounded-lg flex items-center justify-center gap-2 mt-6"
            >
              Continue (Demo)
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo mode — no real authentication required
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
