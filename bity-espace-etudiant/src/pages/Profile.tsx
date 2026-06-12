import React from 'react';
import { Star, CheckCircle2, ChevronRight, LogOut, Settings, Shield, Clock, UserCircle, Edit, X, Plus, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { authFetch, requireAuth, getUser } from '@/src/lib/api';

export default function ProfilePage() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    university: '',
    interests: [] as string[]
  });
  const [interestInput, setInterestInput] = React.useState('');

  const fetchProfile = async () => {
    try {
      const res = await authFetch('/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('bity_user', JSON.stringify(data.user));
      } else {
        setUser(getUser());
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setUser(getUser());
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await authFetch('/student/dashboard-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  React.useEffect(() => {
    requireAuth();
    fetchProfile();
    fetchStats();
  }, []);

  React.useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        university: user.university || '',
        interests: user.interests || []
      });
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await authFetch('/auth/profile/avatar', {
        method: 'PUT',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('bity_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('user-profile-updated'));
      } else {
        const errData = await res.json();
        alert(errData.message || "Erreur lors du téléchargement de l'image");
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert("Une erreur s'est produite lors du téléchargement.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bity_token');
    localStorage.removeItem('bity_user');
    window.location.href = 'http://localhost:3000';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('bity_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('user-profile-updated'));
        setIsEditing(false);
        fetchStats();
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !editForm.interests.includes(interestInput.trim())) {
      setEditForm(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (tag: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== tag)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-bold uppercase tracking-wider text-sm animate-pulse">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() || user.username || user.email : 'Étudiant Bity';

  return (
    <div className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 md:grid-cols-12 gap-10">
      {/* Sidebar/Profile Card */}
      <div className="md:col-span-4 flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-lowest rounded-[32px] p-10 border border-outline-variant/30 ambient-shadow flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/5 rounded-full blur-3xl" />
          
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden relative mb-6 z-10 group/avatar cursor-pointer">
            <img 
              src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"} 
              alt={fullName} 
              className="w-full h-full object-cover transition-transform duration-350 group-hover/avatar:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
              <Camera className="w-6 h-6 text-white mb-1" />
              <span className="text-[9px] text-white font-bold uppercase tracking-wider">Modifier</span>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              onChange={handleAvatarChange}
            />
          </div>
          
          <h1 className="font-display text-3xl font-bold text-on-surface z-10 tracking-tight">{fullName}</h1>
          <div className="mt-4 flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full z-10 ring-1 ring-secondary/20">
            <CheckCircle2 className="w-5 h-5 text-secondary" />
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">
              {user?.is_verified ? 'Étudiant Vérifié' : 'En Attente de Vérification'}
            </span>
          </div>

          <div className="w-full h-[1px] bg-outline-variant/20 my-8 z-10" />

          <div className="w-full bg-surface-container/50 rounded-2xl p-6 flex justify-between items-center z-10 border border-outline-variant/10">
            <div className="text-left">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-1">Score de Confiance</p>
              <div className="font-display text-2xl font-bold flex items-baseline">
                {user?.rankingScore || 4.8} <span className="text-on-surface-variant font-medium text-sm ml-1">/ 5</span>
              </div>
            </div>
            <div className="flex gap-0.5 text-secondary">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              <Star className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        {/* Vertical Nav (Desktop) */}
        <div className="hidden md:flex flex-col gap-1 bg-surface-container-lowest rounded-[32px] p-6 border border-outline-variant/30 ambient-shadow">
          {[
            { label: 'Informations Personnelles', icon: UserCircle, active: true },
            { label: 'Modifier le Profil', icon: Edit, onClick: () => setIsEditing(true) },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={item.onClick}
              className={cn(
                "flex items-center justify-between w-full p-4 rounded-2xl transition-all group text-left",
                item.active ? "bg-secondary text-white shadow-xl shadow-secondary/20" : "text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", item.active && "text-white/50")} />
            </button>
          ))}
          <div className="h-[1px] bg-outline-variant/10 my-4 mx-4" />
          <button onClick={handleLogout} className="flex items-center gap-4 w-full p-4 rounded-2xl text-error hover:bg-error/5 transition-all group">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-tight">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:col-span-8 flex flex-col gap-12">
        {/* Dynamic Stats Row */}
        {stats && (
          <section className="grid grid-cols-3 gap-6">
            {[
              { label: "Logements actifs", value: stats.activeAdsCount, icon: "🏠" },
              { label: "Annonces favorites", value: stats.savedAdsCount, icon: "❤️" },
              { label: "Alertes reçues", value: stats.unreadNotificationsCount, icon: "🔔" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-2 ambient-shadow relative overflow-hidden">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
                <span className="font-display text-2xl font-bold text-primary">{stat.value}</span>
              </div>
            ))}
          </section>
        )}

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-2xl font-bold text-primary tracking-tight">Informations Personnelles</h2>
            <button 
              onClick={() => setIsEditing(true)}
              className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" /> Modifier
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-[32px] p-10 border border-outline-variant/30 ambient-shadow space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Établissement', value: user?.university || 'Non renseigné' },
                { label: 'Statut / Rôle', value: user?.role === 'student' ? 'Étudiant' : user?.role === 'owner' ? 'Propriétaire' : 'Admin' },
                { label: 'Téléphone', value: user?.phone || 'Non renseigné' },
                { label: 'E-mail', value: user?.email || 'Non renseigné' },
              ].map((info, i) => (
                <div key={i} className="space-y-2">
                   <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">{info.label}</label>
                  <div className="bg-surface-container-low/50 border border-outline-variant/30 rounded-xl p-4 font-bold text-on-surface">
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-3 pt-2">
                {user?.interests && user.interests.length > 0 ? (
                  user.interests.map((tag: string, i: number) => (
                    <span key={i} className="bg-secondary/5 text-secondary border border-secondary/20 px-5 py-2 rounded-full font-bold text-sm">
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-on-surface-variant text-sm font-medium italic">Aucun centre d'intérêt renseigné. Cliquez sur Modifier pour en ajouter !</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="font-display text-2xl font-bold text-primary tracking-tight">Activités récentes</h2>
            <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">Voir Tout</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Tunis Centre', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200', time: 'Il y a 2 jours' },
              { title: 'La Marsa', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=200', time: 'Il y a 1 semaine' },
            ].map((item, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/20 ambient-shadow flex gap-4 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-outline-variant/10">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Recherche récente</p>
                  <p className="font-bold text-on-surface truncate">{item.title}</p>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-outline mt-1.5">
                    <Clock className="w-3 h-3" /> {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links (Mobile) */}
        <section className="md:hidden flex flex-col gap-3">
          <button onClick={() => setIsEditing(true)} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 flex justify-between items-center group active:scale-95 transition-all text-left w-full">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <Edit className="w-5 h-5 text-secondary" />
              <span className="font-bold">Modifier le Profil</span>
            </div>
            <ChevronRight className="w-4 h-4 text-outline" />
          </button>
          <Link to="/review" className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 flex justify-between items-center group active:scale-95 transition-all">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <Star className="w-5 h-5 text-secondary" />
              <span className="font-bold">Laisser un avis</span>
            </div>
            <ChevronRight className="w-4 h-4 text-outline" />
          </Link>
          <button onClick={handleLogout} className="bg-error/5 rounded-2xl p-5 border border-error/20 flex items-center justify-center gap-3 text-error font-bold active:scale-95 transition-all w-full">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-container-lowest rounded-[32px] border border-outline-variant/40 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-10 space-y-6"
            >
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
                <h3 className="font-display text-2xl font-bold text-primary">Modifier votre Profil</h3>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="p-2 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Prénom</label>
                    <input 
                      type="text" 
                      value={editForm.firstName}
                      onChange={e => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Nom de famille</label>
                    <input 
                      type="text" 
                      value={editForm.lastName}
                      onChange={e => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Numéro de téléphone</label>
                    <input 
                      type="text" 
                      value={editForm.phone}
                      onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Établissement / Université</label>
                    <input 
                      type="text" 
                      value={editForm.university}
                      onChange={e => setEditForm(prev => ({ ...prev, university: e.target.value }))}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Centres d'intérêt</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={interestInput}
                      onChange={e => setInterestInput(e.target.value)}
                      placeholder="Ajouter un centre d'intérêt (ex: E-sport)..."
                      className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all font-semibold text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={addInterest}
                      className="bg-secondary text-white px-5 rounded-xl font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md hover:bg-secondary/90 text-sm"
                    >
                      <Plus className="w-4 h-4" /> Ajouter
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {editForm.interests.map((tag, i) => (
                      <span key={i} className="bg-secondary/5 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2">
                        {tag}
                        <button 
                          type="button" 
                          onClick={() => removeInterest(tag)}
                          className="hover:text-error transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 border-t border-outline-variant/20 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container-high transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-secondary/90 transition-all shadow-lg active:scale-95"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
