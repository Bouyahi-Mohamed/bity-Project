import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, ChevronRight, Star, Send, ArrowLeft, Eye, MessageSquare, Shield } from 'lucide-react';
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
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await authFetch(`/auth/users?role=${selectedRole}&query=${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
        // Autoselect first result if available and no user is selected
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
        
        // Refresh selected user info
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
      alert('Erreur serveur lors de la soumission de l\'avis.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel h-16 px-6 flex items-center justify-between border-b border-outline-variant/10 md:hidden">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-container">
          <ArrowLeft className="w-6 h-6 text-secondary" />
        </button>
        <h1 className="font-display font-bold text-secondary">Évaluer & Info</h1>
        <div className="w-10" />
      </header>

      <div className="flex flex-col gap-10">
        {/* Search Header */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-secondary transition-colors w-5 h-5" />
          <input
            type="text"
            className="w-full pl-16 pr-6 py-5 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl focus:ring-8 focus:ring-secondary/5 focus:border-secondary transition-all font-sans text-lg text-on-surface placeholder:text-outline"
            placeholder="Rechercher par nom..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Toggle Controls */}
        <div className="flex p-1.5 bg-surface-container rounded-[20px] shadow-inner border border-outline-variant/10">
          <button 
            onClick={() => { setSelectedRole('student'); setSelectedUser(null); }}
            className={cn(
              "flex-1 py-4 text-center rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
              selectedRole === 'student' ? "bg-white text-secondary shadow-xl ring-1 ring-secondary/5" : "text-on-surface-variant hover:bg-white/50"
            )}
          >
            COLOCATAIRE
          </button>
          <button 
            onClick={() => { setSelectedRole('owner'); setSelectedUser(null); }}
            className={cn(
              "flex-1 py-4 text-center rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
              selectedRole === 'owner' ? "bg-white text-secondary shadow-xl ring-1 ring-secondary/5" : "text-on-surface-variant hover:bg-white/50"
            )}
          >
            PROPRIÉTAIRE
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">Résultats de recherche ({usersList.length})</h2>
          </div>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
            {usersList.map((usr) => {
              const usrName = `${usr.firstName} ${usr.lastName}`.trim() || usr.username || usr.email;
              const isSelected = selectedUser?._id === usr._id;
              return (
                <button 
                  key={usr._id}
                  onClick={() => setSelectedUser(usr)}
                  className={cn(
                    "w-full flex items-center gap-6 p-6 rounded-[24px] text-left transition-all ambient-shadow border-2",
                    isSelected ? "bg-secondary/5 border-secondary" : "bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container-low"
                  )}
                >
                  <div className="w-14 h-14 rounded-full border border-outline-variant/10 overflow-hidden shrink-0">
                    <img 
                      src={usr.role === 'student' ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"} 
                      className="w-full h-full object-cover" 
                      alt={usrName} 
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-on-surface">{usrName}</h4>
                    <p className="text-on-surface-variant text-sm font-medium">
                      {usr.role === 'student' ? 'Colocataire / Étudiant' : 'Propriétaire'} {usr.university ? `à ${usr.university}` : ''}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-secondary fill-current text-white" />}
                </button>
              );
            })}
            {usersList.length === 0 && (
              <p className="text-center text-on-surface-variant italic py-4">Aucun profil correspondant trouvé.</p>
            )}
          </div>
        </div>

        {/* Summary Mini-Profile */}
        {selectedUser && (
          <div className="bg-surface-container-low/50 rounded-[32px] p-8 border border-outline-variant/30 ambient-shadow">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden shrink-0">
                <img 
                  src={selectedUser.role === 'student' ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"} 
                  className="w-full h-full object-cover" 
                  alt="Avatar" 
                />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">
                  {`${selectedUser.firstName} ${selectedUser.lastName}`.trim() || selectedUser.username}
                </h3>
                <p className="text-on-surface-variant font-medium">Membre depuis {new Date(selectedUser.createdAt).getFullYear()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Score de confiance</span>
                <div className="flex items-center gap-1.5 font-display text-lg font-bold">
                  <Shield className="w-4 h-4 text-secondary fill-current" /> {selectedUser.rankingScore || 5.0}/5
                </div>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Activité</span>
                <div className="flex items-center gap-1.5 font-display text-lg font-bold">
                  <MessageSquare className="w-4 h-4 text-secondary" /> {selectedUser.rankingCount || 0} avis
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/student/${selectedUser._id}`)}
              className="w-full py-4 bg-white border border-secondary text-secondary font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-secondary/5 transition-all flex items-center justify-center gap-2 group"
            >
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" /> Voir le profil complet
            </button>
          </div>
        )}

        {/* The Rating Card */}
        {selectedUser && (
          <>
            <div className="bg-surface-container-lowest rounded-[32px] p-10 border border-outline-variant/20 ambient-shadow text-center space-y-6">
              <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">
                Noter {`${selectedUser.firstName} ${selectedUser.lastName}`.trim() || selectedUser.username}
              </h3>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="transition-all hover:scale-125 focus:scale-110"
                  >
                    <Star 
                      className={cn(
                        "w-12 h-12 transition-colors", 
                        star <= rating ? "text-secondary fill-current shadow-blue-500/10" : "text-surface-container-highest"
                      )} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mt-4">
                {rating === 0 ? "Appuyez pour noter" : `${rating} étoiles sélectionnées`}
              </p>
            </div>

            {/* Review Form */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-2" htmlFor="review">Rédigez votre avis</label>
              <textarea
                id="review"
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-8 font-medium text-on-surface focus:ring-8 focus:ring-secondary/5 focus:border-secondary transition-all resize-none shadow-sm placeholder:text-outline"
                placeholder={`Décrivez votre expérience avec ${selectedUser.firstName || selectedUser.username}...`}
                rows={5}
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              />
            </div>

            <button 
              onClick={handleSubmitFeedback}
              disabled={submitting || rating === 0}
              className={cn(
                "w-full bg-secondary text-on-secondary font-display text-xl font-bold py-6 rounded-[24px] shadow-2xl shadow-secondary/20 hover:bg-secondary/90 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 group",
                (submitting || rating === 0) && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
              {submitting ? 'Envoi en cours...' : 'Envoyer l\'avis'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
