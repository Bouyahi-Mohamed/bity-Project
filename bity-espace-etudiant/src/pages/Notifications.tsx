import React from 'react';
import { TrendingDown, Calendar, Home, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { authFetch, requireAuth } from '@/src/lib/api';

interface Notification {
  id: string;
  type: 'price_drop' | 'visit' | 'match' | 'system';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  image?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await authFetch('/student/notifications');
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          const mapped = data.notifications.map((n: any) => {
            let type: 'price_drop' | 'visit' | 'match' | 'system' = 'system';
            if (n.type === 'PRICE_DROP') type = 'price_drop';
            else if (n.type === 'NEW_AD') type = 'match';
            
            const createdDate = new Date(n.createdAt);
            const diffMs = Date.now() - createdDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            let timeStr = "À l'instant";
            if (diffDays > 0) {
              timeStr = `Il y a ${diffDays} j`;
            } else if (diffHours > 0) {
              timeStr = `Il y a ${diffHours} h`;
            } else if (diffMins > 0) {
              timeStr = `Il y a ${diffMins} min`;
            }

            return {
              id: n._id,
              type,
              title: n.type === 'PRICE_DROP' ? "Baisse de prix détectée !" : n.type === 'NEW_AD' ? "Nouveau logement assorti !" : "Notification Système",
              message: n.text,
              time: timeStr,
              unread: !n.read
            };
          });
          setNotifications(mapped);
        }
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    requireAuth();
    fetchNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      const res = await authFetch('/student/notifications/read', { method: 'POST' });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-bold uppercase tracking-wider text-sm animate-pulse">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary mb-2 tracking-tight">Centre de notifications</h1>
          <p className="text-on-surface-variant font-medium">
            {unreadCount > 0 ? `Vous avez ${unreadCount} nouvelles alertes.` : 'Aucune nouvelle notification.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="text-secondary font-bold text-xs uppercase tracking-wider hover:underline underline-offset-4 hidden sm:block"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Chips */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-6 py-2 rounded-full bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider shadow-lg">Toutes</button>
        <button className="px-6 py-2 rounded-full bg-white border border-outline-variant/30 text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-all">Non lues</button>
        <button className="px-6 py-2 rounded-full bg-white border border-outline-variant/30 text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container transition-all">Alertes de prix</button>
      </div>

      <div className="flex flex-col gap-5">
        {notifications.map((notif, index) => (
          <motion.article
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative bg-surface-container-lowest border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 transition-all hover:-translate-y-1 shadow-sm",
              notif.unread ? "border-secondary/40 shadow-blue-500/10" : "border-outline-variant/20 opacity-90 grayscale-[0.2]"
            )}
          >
            {notif.unread && (
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-secondary shadow-lg shadow-secondary/50" />
            )}

            <div className={cn(
              "flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center",
              notif.type === 'price_drop' ? "bg-secondary/10 text-secondary" :
              notif.type === 'visit' ? "bg-surface-container-high text-on-surface" :
              notif.type === 'match' ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-outline"
            )}>
              {notif.type === 'price_drop' && <TrendingDown className="w-6 h-6" />}
              {notif.type === 'visit' && <Calendar className="w-6 h-6" />}
              {notif.type === 'match' && <Home className="w-6 h-6" />}
              {notif.type === 'system' && <ShieldCheck className="w-6 h-6" />}
            </div>

            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                  notif.type === 'price_drop' ? "bg-secondary/10 text-secondary" : "bg-surface-container text-on-surface-variant"
                )}>
                  {notif.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">{notif.time}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface mb-2">{notif.title}</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed mb-4">{notif.message}</p>
              
              <div className="flex flex-wrap gap-3">
                <button className="bg-secondary text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-secondary/90 transition-all shadow-md active:scale-95">
                  Voir plus
                </button>
                {notif.type === 'visit' && (
                  <button className="bg-transparent text-on-surface-variant px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-surface-container transition-all">
                    Reprogrammer
                  </button>
                )}
              </div>
            </div>

            {notif.image && (
              <div className="hidden sm:block flex-shrink-0 w-32 h-24 rounded-xl overflow-hidden border border-outline-variant/20 shadow-inner">
                <img src={notif.image} className="w-full h-full object-cover" alt="Context" />
              </div>
            )}
          </motion.article>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline underline-offset-8">
          Charger plus de notifications
        </button>
      </div>
    </div>
  );
}
