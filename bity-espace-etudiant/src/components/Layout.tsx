import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Compass, Heart, Bell, User, Home, MessageCircle, Info, Settings, Shield, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getUser } from '@/src/lib/api';

// TODO: In the future, fetch real unread count from GET /api/messages/unread-count
const MOCK_UNREAD_MESSAGES = 2;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<any>(getUser());
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleUpdate = () => {
      setUser(getUser());
    };
    window.addEventListener('user-profile-updated', handleUpdate);
    return () => window.removeEventListener('user-profile-updated', handleUpdate);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('bity_token');
    localStorage.removeItem('bity_user');
    window.location.href = 'http://localhost:3000';
  };

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

          {/* Right side: message icon + avatar dropdown */}
          <div className="flex items-center gap-3">
            {/* Message icon with unread badge */}
            <button
              onClick={() => navigate('/messages')}
              className="relative p-2 rounded-full hover:bg-surface-container transition-colors"
              aria-label="Messages"
            >
              <MessageCircle className="w-6 h-6 text-on-surface-variant hover:text-secondary transition-colors" />
              {MOCK_UNREAD_MESSAGES > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-secondary text-on-secondary text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                  {MOCK_UNREAD_MESSAGES}
                </span>
              )}
            </button>

            {/* Avatar Dropdown Toggle (Desktop dropdown / Mobile direct link) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    navigate('/profile');
                  } else {
                    setShowDropdown(prev => !prev);
                  }
                }}
                className="flex items-center rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all active:scale-95"
                aria-label="Menu utilisateur"
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-outline-variant/30 object-cover shadow-sm"
                />
              </button>

              {/* Popover Dropdown Menu (Desktop only) */}
              {showDropdown && (
                <div className="hidden md:block absolute right-0 mt-3 w-72 bg-surface-container-lowest rounded-3xl border border-outline-variant/20 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Header */}
                  <div className="px-3 py-3 border-b border-outline-variant/15 flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-outline-variant/30 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display font-bold text-sm text-primary truncate">
                        {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Mohamed Bouyahi' : 'Mohamed Bouyahi'}
                      </p>
                      <p className="text-[11px] text-outline truncate font-medium">
                        {user?.email || 'bouyahi.mohamed.1@gmail.com'}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2 space-y-1">
                    <button
                      onClick={() => { setShowDropdown(false); navigate('/profile'); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                          <User size={15} />
                        </div>
                        <span>Mon Profil</span>
                      </div>
                      <ChevronRight size={14} className="text-outline" />
                    </button>

                    <button
                      onClick={() => { setShowDropdown(false); navigate('/review'); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                          <Info size={15} />
                        </div>
                        <span>Évaluer & Info</span>
                      </div>
                      <ChevronRight size={14} className="text-outline" />
                    </button>

                    {/* Settings & privacy (TODO) */}
                    <button
                      onClick={() => { setShowDropdown(false); alert("Settings & privacy — Cette fonctionnalité sera disponible dans la prochaine mise à jour (TODO)."); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                          <Settings size={15} />
                        </div>
                        <span>Settings & privacy</span>
                      </div>
                      <ChevronRight size={14} className="text-outline" />
                    </button>

                    {/* Help & support (TODO) */}
                    <button
                      onClick={() => { setShowDropdown(false); alert("Help & support — Cette fonctionnalité sera disponible dans la prochaine mise à jour (TODO)."); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                          <Shield size={15} />
                        </div>
                        <span>Help & support</span>
                      </div>
                      <ChevronRight size={14} className="text-outline" />
                    </button>
                  </div>

                  {/* Logout button */}
                  <div className="pt-2 border-t border-outline-variant/15">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-error hover:bg-error/10 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-error/10 text-error flex items-center justify-center">
                        <LogOut size={15} />
                      </div>
                      <span>Se Déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
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
          <Compass className="w-6 h-6" />
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

        {/* Messages tab */}
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-90 relative",
              isActive ? "text-secondary bg-secondary-container/10" : "text-outline hover:text-secondary"
            )
          }
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            {MOCK_UNREAD_MESSAGES > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 bg-secondary text-on-secondary text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                {MOCK_UNREAD_MESSAGES}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Messages</span>
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
