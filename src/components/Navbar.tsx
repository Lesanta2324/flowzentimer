import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Timer, BarChart3, Moon, Sun, ArrowLeft, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorThemePicker } from '@/components/ColorThemePicker';
import type { ColorTheme } from '@/hooks/useColorTheme';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  colorTheme: ColorTheme;
  onColorThemeChange: (theme: ColorTheme) => void;
}

export function Navbar({ isDark, onToggleTheme, colorTheme, onColorThemeChange }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const showBack = location.pathname !== '/';

  const navItems = [
    { to: '/timer', icon: Timer, label: 'Timer' },
    { to: '/progress', icon: BarChart3, label: 'Progress' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FlowZen" className="h-9 w-9" />
            <span className="font-heading font-bold text-lg text-foreground tracking-tight">FlowZen</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button
                variant={location.pathname === item.to ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-xl gap-1.5 text-sm"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
          <ColorThemePicker current={colorTheme} onChange={onColorThemeChange} />
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={onToggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleSignOut} title="Sign Out">
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="rounded-xl gap-1.5 text-sm">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
