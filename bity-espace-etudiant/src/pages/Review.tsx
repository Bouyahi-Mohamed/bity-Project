import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Star, Send, ArrowLeft, Eye, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { authFetch, requireAuth } from '@/src/lib/api';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'owner'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await authFetch(`/auth/users?role=${selectedRole}&query=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
        if (data.users && data.users.length > 0 && !selectedUser) {
          setSelectedUser(data.users[0]);
        }
      }
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  useEffect(() => {
    requireAuth();
    fetchUsers();
  }, [selectedRole, searchQuery]);

  const handleSubmitFeedback = async () => {
    if (!selectedUser || rating === 0) {
      alert('Veuillez sélectionner un utilisateur et attribuer une note.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch('/auth/users/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser._id, rating })
      });
      if (res.ok) {
        alert('Votre avis a été enregistré et le score intelligent recalculé !');
        const userRes = await authFetch(`/auth/users/${selectedUser._id}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setSelectedUser(userData.user);
        }
        setRating(0);
        setFeedbackText('');
      } else {
        const errData = await res.json();
        alert(errData.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert("Erreur serveur lors de la soumission de l'avis.");
    } finally {
      setSubmitting(false);
    }
  };

  const userName = selectedUser
    ? `${selectedUser.firstName} ${selectedUser.lastName}`.trim() || selectedUser.username
    : '';

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10 px-4 pt-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate(-1)} className="text-secondary p-2 -ml-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-secondary">Évaluer &amp; Info</h1>
        <div className="w-10" />
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Rechercher par nom..."
          className="w-full pl-14 pr-6 py-4 bg-white border border-surface-container-highest rounded-2xl shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all font-medium text-lg text-primary placeholder:text-on-surface-variant"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tab Selector */}
      <div className="p-1 bg-surface-container-low rounded-2xl flex border border-surface-container">
        <button
          onClick={() => { setSelectedRole('student'); setSelectedUser(null); }}
          className={cn(
            'flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all',
            selectedRole === 'student'
              ? 'bg-white shadow-sm text-secondary'
              : 'text-on-surface-variant hover:bg-white/50'
          )}
        >
          Colocataire
        </button>
        <button
          onClick={() => { setSelectedRole('owner'); setSelectedUser(null); }}
          className={cn(
            'flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all',
            selectedRole === 'owner'
              ? 'bg-white shadow-sm text-secondary'
              : 'text-on-surface-variant hover:bg-white/50'
          )}
        >
          Propriétaire
        </button>
      </div>

      {/* Search Results */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
          Résultats de recherche ({usersList.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {usersList.map((usr, idx) => {
            const usrName = `${usr.firstName} ${usr.lastName}`.trim() || usr.username || usr.email;
            const isSelected = selectedUser?._id === usr._id;
            const avatar =
              usr.role === 'student'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200';
            return (
              <motion.div
                key={usr._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => setSelectedUser(usr)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl text-left relative cursor-pointer border-2 transition-all',
                  isSelected
                    ? 'bg-[#eff6ff] border-[#3b82f6]'
                    : 'bg-white border-surface-container hover:border-secondary/30'
                )}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border border-surface-container shrink-0">
                  <img src={avatar} className="w-full h-full object-cover" alt={usrName} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-primary">{usrName}</h4>
                  <p className="text-[13px] text-on-surface-variant font-medium">
                    {usr.role === 'student' ? 'Colocataire / Étudiant' : 'Propriétaire'}
                    {usr.university ? ` à ${usr.university}` : ''}
                    {isSelected && (
                      <span className="text-[#3b82f6] font-bold ml-1">• Voir plus</span>
                    )}
                  </p>
                </div>
                {isSelected && (
                  <div className="bg-[#3b82f6] text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                    <CheckCircle2 size={16} fill="currentColor" fillOpacity={0.4} />
                  </div>
                )}
              </motion.div>
            );
          })}
          {usersList.length === 0 && (
            <p className="text-center text-on-surface-variant italic py-6">
              Aucun profil correspondant trouvé.
            </p>
          )}
        </div>
      </section>

      {/* Mini Profile Stats Card */}
      {selectedUser && (
        <section className="bg-[#f2f4f6]/50 rounded-3xl p-6 border border-surface-container-highest space-y-6">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate(`/student/${selectedUser._id}`)}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img
                src={
                  selectedUser.role === 'student'
                    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
                    : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
                }
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            </div>
            <div>
              <h4 className="text-lg font-bold text-primary">{userName}</h4>
              <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tighter">
                Membre depuis {new Date(selectedUser.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-surface-container shadow-sm">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Score de confiance
              </p>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.1} />
                <span className="text-lg font-bold text-primary">
                  {selectedUser.rankingScore?.toFixed(1) || '5.0'}/5
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-surface-container shadow-sm">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                Activité
              </p>
              <div className="flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#3b82f6]" strokeWidth={2.5} />
                <span className="text-lg font-bold text-primary">
                  {selectedUser.rankingCount || 0} avis vérifiés
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/student/${selectedUser._id}`)}
            className="w-full py-3.5 border-2 border-[#3b82f6] text-[#3b82f6] font-bold text-[11px] uppercase tracking-widest rounded-xl px-4 flex items-center justify-center gap-2 hover:bg-[#3b82f6]/5 transition-all active:scale-[0.98]"
          >
            <Eye size={18} strokeWidth={2.5} /> Voir le profil complet
          </button>
        </section>
      )}

      {/* Rating Section */}
      {selectedUser && (
        <section className="bg-white rounded-[32px] p-8 border border-surface-container-highest shadow-sm flex flex-col items-center gap-6">
          <h3 className="text-xl font-bold text-primary mt-2">
            Noter {userName}
          </h3>

          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(i)}
                className={`transition-colors outline-none ${
                  (hoverRating || rating) >= i ? 'text-[#eab308]' : 'text-surface-container-highest'
                }`}
              >
                <Star
                  size={44}
                  strokeWidth={1}
                  fill={(hoverRating || rating) >= i ? 'currentColor' : 'transparent'}
                />
              </motion.button>
            ))}
          </div>

          <p className="text-sm font-medium text-on-surface-variant -mt-2">
            {rating === 0 ? 'Appuyez pour noter' : `${rating} étoile${rating > 1 ? 's' : ''} sélectionnée${rating > 1 ? 's' : ''}`}
          </p>

          <div className="w-full space-y-2 text-left">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">
              Rédigez votre avis
            </label>
            <textarea
              rows={6}
              placeholder={`Décrivez votre expérience avec ${selectedUser.firstName || selectedUser.username}...`}
              className="w-full bg-surface-container-low/30 border border-surface-container-highest rounded-2xl p-6 text-on-surface font-medium focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none shadow-inner"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            disabled={submitting || rating === 0}
            className={cn(
              'w-full bg-[#0051d5] text-white font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-secondary/20 hover:bg-[#0041ab] transition-all active:scale-[0.98] flex items-center justify-center gap-2',
              (submitting || rating === 0) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Send size={18} />
            {submitting ? "Envoi en cours..." : "Envoyer l'avis"}
          </button>
        </section>
      )}
    </div>
  );
}
