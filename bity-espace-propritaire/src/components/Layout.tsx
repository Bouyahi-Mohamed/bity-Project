import React from 'react';
import { Home, Bell as Notifications, User, UserCircle, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export const Header = () => {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/', label: 'Explorer' },
    { path: '/analytics', label: 'Dashboard' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/profile', label: 'Profil' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container-highest px-6 h-16 max-w-7xl mx-auto left-0 right-0">
      <div className="flex items-center justify-between h-full w-full">
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 hover:opacity-95 active:scale-98 transition-all">
          <Home className="text-secondary" strokeWidth={2.5} size={24} />
          <span className="font-display text-2xl font-bold text-secondary tracking-tighter">bity</span>
        </Link>

        {/* Center Side: Beautiful Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100/60 p-1 rounded-full relative">
          {navItems.map(({ path, label }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                className={`relative px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                  active
                    ? 'text-white font-extrabold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="desktopActiveTab"
                    className="absolute inset-0 bg-secondary rounded-full -z-10 shadow-sm shadow-secondary/15"
                    transition={{ type: 'spring', duration: 0.38, bounce: 0.15 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Quick Profile indicator for layout balance */}
        <div className="flex items-center gap-1.5">
          <Link 
            to="/notifications" 
            className="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-full hover:bg-neutral-50 relative"
          >
            <Notifications size={22} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-error rounded-full border border-white"></span>
          </Link>
          <Link 
            to="/profile" 
            className="text-on-surface-variant hover:text-secondary transition-colors p-2 rounded-full hover:bg-neutral-50"
          >
            <UserCircle size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Explorer' },
    { path: '/analytics', icon: BarChart3, label: 'Dashboard' },
    { path: '/notifications', icon: Notifications, label: 'Notifications' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe bg-white border-t border-surface-container-highest md:hidden rounded-t-2xl shadow-lg animate-fade-in">
      {navItems.map(({ path, icon: Icon, label }) => (
        <Link 
          key={path}
          to={path} 
          className={`flex flex-col items-center justify-center flex-1 transition-all ${isActive(path) ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}
        >
          {isActive(path) ? (
            <div className="bg-secondary/10 rounded-full px-6 py-2 mb-1">
               <Icon size={24} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />
            </div>
          ) : (
             <Icon size={24} strokeWidth={2} className="mb-1" />
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="pt-24 pb-32 md:pb-12 max-w-7xl mx-auto px-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

