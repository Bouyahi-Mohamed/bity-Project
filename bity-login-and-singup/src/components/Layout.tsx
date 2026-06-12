import { ReactNode } from 'react';
import { Home, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  showBack?: boolean;
}

export default function Layout({ children, showBack }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest/70 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          {showBack ? (
            <button 
              onClick={() => navigate(-1)}
              className="text-secondary hover:bg-secondary/10 p-2 rounded-full transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link to="/" className="text-secondary hover:bg-secondary/10 p-2 rounded-full transition-colors flex items-center justify-center">
              <Home className="w-6 h-6" />
            </Link>
          )}

          <h1 className="font-display text-2xl font-bold text-secondary tracking-tight">bity</h1>

          <Link 
            to="/" 
            className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center overflow-hidden hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            <User className="w-5 h-5 text-on-surface-variant" />
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-8 px-4 w-full max-w-xl mx-auto">
        {children}
      </main>
    </div>
  );
}
