import React from 'react';
import { 
  Star, CheckCircle2, ChevronRight, LogOut, Settings, Shield, 
  Clock, BookOpen, UserCircle, Mail, Phone, History, GraduationCap, 
  Calendar, Home, Info, Edit3, Heart, Bell, Camera, Check, X, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { requireAuth, getUser, authFetch } from '../lib/api';

export default function ProfilePage() {
  // Protect route
  requireAuth();
  const navigate = useNavigate();

  const [user, setUser] = React.useState<any>(getUser());
  const [activeTab, setActiveTab] = React.useState<'info' | 'edit'>('info');
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [stats, setStats] = React.useState({
    activeAds: 3,
    favorites: 2,
    alerts: 2
  });

  // Edit form state
  const [formData, setFormData] = React.useState({
    firstName: user?.firstName || 'Mohamed',
    lastName: user?.lastName || 'Bouyahi',
    university: user?.university || 'Sesame',
    phone: user?.phone || '+216 22239082',
    email: user?.email || 'bouyahi.mohamed.1@gmail.com',
    role: user?.role || 'student',
    interests: user?.interests && user.interests.length > 0 ? user.interests : ['dance', 'coding', 'musique']
  });

  const [newInterestInput, setNewInterestInput] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch live stats (favorites & saved count if available)
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const [savedRes, notifRes, adsRes] = await Promise.allSettled([
          authFetch('/student/saved'),
          authFetch('/student/notifications'),
          authFetch('/ads')
        ]);
        
        let favCount = 2;
        let alertCount = 2;
        let activeAdsCount = 3;

        if (savedRes.status === 'fulfilled' && savedRes.value.ok) {
          const data = await savedRes.value.json();
          if (Array.isArray(data.saved)) favCount = data.saved.length;
        }

        if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
          const data = await notifRes.value.json();
          if (Array.isArray(data.notifications)) alertCount = data.notifications.length;
        }

        if (adsRes.status === 'fulfilled' && adsRes.value.ok) {
          const data = await adsRes.value.json();
          if (Array.isArray(data.ads)) activeAdsCount = data.ads.length;
        }

        setStats({
          activeAds: activeAdsCount,
          favorites: favCount,
          alerts: alertCount
        });
      } catch (err) {
        console.warn('Could not load dynamic stats, using defaults', err);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('bity_token');
    localStorage.removeItem('bity_user');
    window.location.href = 'http://localhost:3000';
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('avatar', file);

    try {
      const res = await authFetch('/auth/profile/avatar', {
        method: 'PUT',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        const updatedUser = { ...user, avatar: result.avatarUrl };
        setUser(updatedUser);
        localStorage.setItem('bity_user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('user-profile-updated'));
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await authFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          university: formData.university,
          phone: formData.phone,
          interests: formData.interests
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const updatedUser = { ...user, ...result.user };
        setUser(updatedUser);
        localStorage.setItem('bity_user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('user-profile-updated'));
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          setActiveTab('info');
        }, 1200);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const addInterest = () => {
    if (!newInterestInput.trim()) return;
    if (!formData.interests.includes(newInterestInput.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterestInput.trim().toLowerCase()]
      }));
    }
    setNewInterestInput('');
  };

  const removeInterest = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((i: string) => i !== tag)
    }));
  };

  const fullName = user ? `${user.firstName || 'Mohamed'} ${user.lastName || 'Bouyahi'}` : `${formData.firstName} ${formData.lastName}`;
  const userInitials = user?.firstName 
    ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase() 
    : 'MB';

  const avatarUrl = user?.avatar 
    ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`)
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';

  const isOwner = user?.role === 'owner';
  const roleLabel = isOwner ? 'Propriétaire' : 'Étudiant';
  const badgeLabel = isOwner ? 'PROPRIÉTAIRE VÉRIFIÉ' : 'ÉTUDIANT VÉRIFIÉ';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN: Profile Card & Navigation ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: User Summary Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 ambient-shadow flex flex-col items-center text-center">
            {/* Avatar with edit overlay */}
            <div className="relative mb-5 group">
              <div className="w-28 h-28 rounded-full border-4 border-surface-container-lowest shadow-xl overflow-hidden ring-2 ring-outline-variant/20 bg-surface-container flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-display font-bold text-primary">{userInitials}</span>
                )}
              </div>

              {/* Quick photo change trigger */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-secondary text-on-secondary rounded-full border-2 border-surface-container-lowest flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                title="Changer la photo"
              >
                <Camera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>

            {/* User Name */}
            <h1 className="font-display text-2xl font-bold text-primary capitalize tracking-tight mb-2">
              {fullName}
            </h1>

            {/* Verified Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#1e40af] px-3.5 py-1.5 rounded-full border border-[#dbeafe] text-xs font-bold mb-6 shadow-sm">
              <CheckCircle2 size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.2} />
              <span>{badgeLabel}</span>
            </div>

            {/* Score de Confiance Box */}
            <div className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-0.5 text-left">
                  Score de confiance
                </span>
                <span className="font-display text-lg font-bold text-primary">
                  5 <span className="text-xs text-outline font-medium">/ 5</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#2563eb]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={15} fill="currentColor" className="text-[#2563eb]" />
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Desktop Sidebar Navigation Menu (Hidden on Mobile) */}
          <div className="hidden lg:block bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/20 ambient-shadow space-y-2">
            <button
              onClick={() => {
                setActiveTab('info');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all",
                activeTab === 'info'
                  ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25"
                  : "text-primary hover:bg-surface-container"
              )}
            >
              <div className="flex items-center gap-3">
                <UserCircle size={18} />
                <span>Informations Personnelles</span>
              </div>
              <ChevronRight size={16} className={activeTab === 'info' ? "text-white/80" : "text-outline"} />
            </button>

            <Link
              to="/review"
              className="w-full bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Info size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Évaluer & Info</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </Link>

            {/* Settings & privacy (TODO) */}
            <button
              onClick={() => alert("Settings & privacy — Cette fonctionnalité sera disponible dans la prochaine mise à jour (TODO).")}
              className="w-full bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Settings size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Settings & privacy</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </button>

            {/* Help & support (TODO) */}
            <button
              onClick={() => alert("Help & support — Cette fonctionnalité sera disponible dans la prochaine mise à jour (TODO).")}
              className="w-full bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Help & support</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </button>

            {/* Se Déconnecter */}
            <button
              onClick={handleLogout}
              className="w-full bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:bg-error/5 hover:border-error/30 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center">
                  <LogOut size={18} />
                </div>
                <span className="font-bold text-sm text-error">Se Déconnecter</span>
              </div>
              <ChevronRight size={16} className="text-error/40 group-hover:text-error transition-colors" />
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Stats, Personal Info & Activity ── */}
        <div className="lg:col-span-8 space-y-6">
          
          

          {/* Middle Card: Informations Personnelles (View or Edit Form) */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 ambient-shadow space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-primary">
                {activeTab === 'edit' ? 'Modifier les Informations' : 'Informations Personnelles'}
              </h2>
              {activeTab === 'info' ? (
                <button
                  onClick={() => setActiveTab('edit')}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1d4ed8] hover:underline uppercase tracking-wider transition-colors"
                >
                  <Edit3 size={14} />
                  <span>Modifier</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('info')}
                  className="flex items-center gap-1 text-xs font-bold text-outline hover:text-primary transition-colors"
                >
                  <X size={14} />
                  <span>Annuler</span>
                </button>
              )}
            </div>

            {/* Tab 1: Info Display (Matching the Image Grid) */}
            {activeTab === 'info' && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Établissement */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Établissement
                    </span>
                    <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary">
                      {formData.university || 'Sesame'}
                    </div>
                  </div>

                  {/* Field 2: Statut / Rôle */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Statut / Rôle
                    </span>
                    <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary">
                      {roleLabel}
                    </div>
                  </div>

                  {/* Field 3: Téléphone */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Téléphone
                    </span>
                    <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary">
                      {formData.phone || '+216 22239082'}
                    </div>
                  </div>

                  {/* Field 4: E-mail */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      E-mail
                    </span>
                    <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary truncate">
                      {formData.email}
                    </div>
                  </div>
                </div>

                {/* Field 5: Centres d'intérêt */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Centres d'intérêt
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest: string) => (
                      <span
                        key={interest}
                        className="bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe] px-4 py-1.5 rounded-full text-xs font-bold capitalize"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Edit Form (Preserving Full Edit Capability) */}
            {activeTab === 'edit' && (
              <motion.form 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSaveProfile}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:border-secondary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:border-secondary"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Établissement
                    </label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={e => setFormData({ ...formData, university: e.target.value })}
                      placeholder="ex: Sesame, INSAT, ESPRIT..."
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:border-secondary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+216 ..."
                      className="w-full bg-surface-container border border-outline-variant/20 rounded-2xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                {/* Edit Interests */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Centres d'intérêt (Ajouter ou retirer)
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {formData.interests.map((interest: string) => (
                      <span
                        key={interest}
                        className="bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe] pl-3 pr-2 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="hover:text-error transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      value={newInterestInput}
                      onChange={e => setNewInterestInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }}
                      placeholder="Ajouter un centre d'intérêt..."
                      className="flex-1 bg-surface-container border border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-medium text-primary focus:outline-none focus:border-secondary"
                    />
                    <button
                      type="button"
                      onClick={addInterest}
                      className="bg-secondary text-on-secondary px-3 py-2 rounded-xl text-xs font-bold hover:bg-secondary/90 transition-all"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? 'Enregistrement...' : saveSuccess ? '✓ Enregistré !' : 'Enregistrer les modifications'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className="px-4 py-3 rounded-2xl text-xs font-bold text-outline hover:text-primary transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Bottom Section: Activités Récentes (Matching the Image) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-primary">
                Activités récentes
              </h2>
              <Link 
                to="/saved" 
                className="text-xs font-bold text-[#1d4ed8] hover:underline uppercase tracking-wider"
              >
                Voir tout
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Activity Card 1 */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/20 ambient-shadow flex items-center gap-4 hover:border-secondary/40 transition-colors">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
                  <img
                    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200"
                    alt="Tunis Centre"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Recherche récente
                  </span>
                  <h4 className="font-display font-bold text-base text-primary truncate">
                    Tunis Centre
                  </h4>
                  <span className="text-xs text-outline font-medium flex items-center gap-1 mt-0.5">
                    <Clock size={12} /> Il y a 2 jours
                  </span>
                </div>
              </div>

              {/* Activity Card 2 */}
              <div className="bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/20 ambient-shadow flex items-center gap-4 hover:border-secondary/40 transition-colors">
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container">
                  <img
                    src="https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&q=80&w=200"
                    alt="La Marsa"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Recherche récente
                  </span>
                  <h4 className="font-display font-bold text-base text-primary truncate">
                    La Marsa
                  </h4>
                  <span className="text-xs text-outline font-medium flex items-center gap-1 mt-0.5">
                    <Clock size={12} /> Il y a 1 semaine
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOBILE BOTTOM ACTION MENU (Visible only on Mobile screens < lg) ── */}
          <div className="block lg:hidden mt-8 space-y-2">
            <h3 className="font-display font-bold text-lg text-primary mb-3">
              Options & Compte
            </h3>
            
            <button
              onClick={() => {
                setActiveTab('info');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border border-outline-variant/20 font-bold text-sm transition-all",
                activeTab === 'info'
                  ? "bg-[#1d4ed8] text-white shadow-lg shadow-blue-500/25"
                  : "bg-surface-container-lowest text-primary hover:bg-surface-container"
              )}
            >
              <div className="flex items-center gap-3.5">
                <div className={cn("w-9 h-9 rounded-full flex items-center justify-center", activeTab === 'info' ? "bg-white/20 text-white" : "bg-[#eff6ff] text-[#3b82f6]")}>
                  <UserCircle size={18} />
                </div>
                <span>Informations Personnelles</span>
              </div>
              <ChevronRight size={16} className={activeTab === 'info' ? "text-white/80" : "text-outline"} />
            </button>

            <Link
              to="/review"
              className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Info size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Évaluer & Info</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </Link>

            {/* Settings & privacy (TODO) */}
            <button
              onClick={() => alert("Settings & privacy — Cette fonctionnalité sera disponible dans la prochaine mise à jour (TODO).")}
              className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Settings size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Settings & privacy</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </button>

            {/* Help & support (TODO) */}
            <button
              onClick={() => alert("Help & support — Cette fonctionnalité sera disponible dans la prochaine mise à jour (TODO).")}
              className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Help & support</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </button>

            {/* Se Déconnecter */}
            <button
              onClick={handleLogout}
              className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:bg-error/5 hover:border-error/30 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center">
                  <LogOut size={18} />
                </div>
                <span className="font-bold text-sm text-error">Se Déconnecter</span>
              </div>
              <ChevronRight size={16} className="text-error/40 group-hover:text-error transition-colors" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
