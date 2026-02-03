import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  LayoutDashboard, 
  Wallet, 
  FileText, 
  User,
  LogOut,
  Settings
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAppStore();

  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';

  const navItems = isClient
    ? [
        { path: '/dashboard/client', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/profile', label: 'Profile', icon: User },
      ]
    : isFreelancer
    ? [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/proof-wallet', label: 'Proof Wallet', icon: Wallet },
        { path: '/profile', label: 'Profile', icon: User },
      ]
    : [
        { path: '/admin', label: 'Admin', icon: LayoutDashboard },
      ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Nexa</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
