import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, Bell, User, Home } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getUser } from '@/src/lib/api';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(getUser());

  React.useEffect(() => {
    const handleUpdate = () => {
      setUser(getUser());
    };
    window.addEventListener('user-profile-updated', handleUpdate);
    return () => window.removeEventListener('user-profile-updated', handleUpdate);
  }, []);

  const avatarUrl = user?.avatar 
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`)
    : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100";

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0">
      {/* Header - Fixed on scroll */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/20 h-16">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-secondary" fill="currentColor" fillOpacity={0.1} />
            <span className="font-display text-2xl font-bold text-secondary tracking-tight">bity</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg",
                  isActive ? "text-secondary bg-secondary-container/10" : "text-on-surface-variant hover:bg-secondary-container/5 hover:text-secondary"
                )
              }
            >
              <Compass className="w-5 h-5" /> Explore
            </NavLink>
            <NavLink
              to="/saved"
              className={({ isActive }) =>
                cn(
                  "font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg",
                  isActive ? "text-secondary bg-secondary-container/10" : "text-on-surface-variant hover:bg-secondary-container/5 hover:text-secondary"
                )
              }
            >
              <Heart className="w-5 h-5" /> Saved
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                cn(
                  "font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg",
                  isActive ? "text-secondary bg-secondary-container/10" : "text-on-surface-variant hover:bg-secondary-container/5 hover:text-secondary"
                )
              }
            >
              <Bell className="w-5 h-5" /> Notifications
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  "font-medium transition-colors flex items-center gap-2 px-3 py-2 rounded-lg",
                  isActive ? "text-secondary bg-secondary-container/10" : "text-on-surface-variant hover:bg-secondary-container/5 hover:text-secondary"
                )
              }
            >
              <User className="w-5 h-5" /> Profile
            </NavLink>
          </nav>

          <NavLink to="/profile" className="flex items-center">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-outline-variant/30 active:scale-95 transition-transform object-cover"
            />
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-outline-variant/10 px-4 py-2 flex justify-around items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90",
              isActive ? "text-secondary bg-secondary-container/10" : "text-outline hover:text-secondary"
            )
          }
        >
          <Compass className={cn("w-6 h-6", (isActive: boolean) => isActive && "fill-current")} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Explore</span>
        </NavLink>
        <NavLink
          to="/saved"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90",
              isActive ? "text-secondary bg-secondary-container/10" : "text-outline hover:text-secondary"
            )
          }
        >
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Saved</span>
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90",
              isActive ? "text-secondary bg-secondary-container/10" : "text-outline hover:text-secondary"
            )
          }
        >
          <Bell className="w-6 h-6" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Alerts</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90",
              isActive ? "text-secondary bg-secondary-container/10" : "text-outline hover:text-secondary"
            )
          }
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-semibold uppercase tracking-wider">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
