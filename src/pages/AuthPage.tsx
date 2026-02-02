import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, User, Briefcase, GraduationCap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@nexa.app');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<UserRole>('freelancer');
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role, name || undefined);
    
    // Navigate based on role
    if (role === 'client') {
      navigate('/dashboard/client');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const roles = [
    { value: 'client' as const, label: 'Client', icon: Briefcase, description: 'Post tasks and hire' },
    { value: 'freelancer' as const, label: 'Freelancer', icon: User, description: 'Work and build proof' },
    { value: 'student' as const, label: 'Student', icon: GraduationCap, description: 'Campus Proof Program' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Nexa</h1>
          <p className="text-muted-foreground mt-2">Turn work into verified proof.</p>
        </div>

        {/* Auth Card */}
        <div className="card-nexa p-8">
          {/* Toggle */}
          <div className="flex bg-secondary rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
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
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
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
                <label className="block text-sm font-semibold text-foreground mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Chen"
                  className="input-nexa w-full"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-nexa w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-nexa w-full"
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                I am a
              </label>
              <div className="space-y-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === r.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      role === r.value ? 'bg-primary/10' : 'bg-secondary'
                    }`}>
                      <r.icon className={`w-5 h-5 ${
                        role === r.value ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold text-sm ${
                        role === r.value ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {r.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3.5 rounded-xl flex items-center justify-center gap-2 mt-6"
            >
              {isLogin ? 'Login' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo mode — use any email and password
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
