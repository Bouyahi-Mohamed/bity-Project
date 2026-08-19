import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Star, Shield, 
  MessageSquare, Clock as ClockIcon, ChevronRight,
  Mail, Phone, GraduationCap, Heart, Calendar, ShieldCheck, Home
} from 'lucide-react';
import { motion } from 'motion/react';
import { authFetch, requireAuth } from '@/src/lib/api';

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  const getStudentMock = (profileId: string) => {
    switch (profileId) {
      case 'faten':
        return {
          name: 'Faten',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.9,
          reviewsCount: 18,
          email: 'faten.insat@gmail.com',
          phone: '+216 55 123 456',
          personalInfo: [
            { label: 'Établissement', value: 'INSAT Tunis' },
            { label: 'Niveau', value: '3e année Génie Logiciel' },
            { label: 'Statut', value: 'Non-fumeuse' },
          ],
          interests: ['Lecture', 'Cinéma', 'Coding', 'Musique'],
          recentActivity: [
            { title: 'Ariana Centre', subtitle: 'Recherche de logement', time: 'Il y a 1 jour', type: 'search' },
            { title: 'Visite programmée: Charguia 2', subtitle: 'Studio Partagé', time: 'Il y a 4 jours', type: 'visit' },
          ]
        };
      case 'farah':
        return {
          name: 'Farah',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.7,
          reviewsCount: 11,
          email: 'farah.esprit@gmail.com',
          phone: '+216 98 654 321',
          personalInfo: [
            { label: 'Établissement', value: 'ESPRIT Tunis' },
            { label: 'Niveau', value: '2e année Informatique' },
            { label: 'Statut', value: 'Calme & Studieuse' },
          ],
          interests: ['Design', 'Photographie', 'Randonnée', 'Séries'],
          recentActivity: [
            { title: 'Ghazela District', subtitle: 'Recherche active', time: 'Il y a 3 jours', type: 'search' },
          ]
        };
      case 'hend':
        return {
          name: 'Hend',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.8,
          reviewsCount: 14,
          email: 'hend.fsegt@gmail.com',
          phone: '+216 23 456 789',
          personalInfo: [
            { label: 'Établissement', value: 'FSEGT Tunis' },
            { label: 'Niveau', value: 'Master Économie' },
            { label: 'Statut', value: 'Aime cuisiner' },
          ],
          interests: ['Cuisine', 'Yoga', 'Lecture', 'Café'],
          recentActivity: [
            { title: 'El Menzah 5', subtitle: 'Recherche active', time: 'Il y a 5 jours', type: 'search' },
          ]
        };
      case 'nourdine':
      case 'nourdine.mansour':
        return {
          name: 'Nourdine Mansour',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
          status: 'Propriétaire Vérifié',
          isOwner: true,
          trustScore: 4.9,
          reviewsCount: 18,
          // TODO: In the future, response rate (Taux de réponse) will be calculated dynamically from the chat/messages database collection based on the owner's response time to incoming student messages.
          responseRate: '100%',
          email: 'nourdine@gmail.com',
          phone: '+216 98 123 789',
          personalInfo: [
            { label: 'Type de compte', value: 'Bailleur Certifié' },
            { label: 'Taux de réponse', value: '100% (Répond généralement en moins d\'une heure)' },
            { label: 'Logements actifs', value: '2 annonces publiées' },
            { label: 'Membre depuis', value: '2022' },
          ],
          interests: ['Immobilier', 'Gestion locative', 'Rénovation'],
          recentActivity: [
            { title: 'S+3 Colocation El Menzah 5', subtitle: 'Annonce active', time: 'En ligne', type: 'search' },
            { title: 'S+1 Centre Ville', subtitle: 'Annonce active', time: 'En ligne', type: 'search' },
          ]
        };
      default:
        return {
          name: 'Nourdine Mansour',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
          status: 'Propriétaire Vérifié',
          isOwner: true,
          trustScore: 4.9,
          reviewsCount: 18,
          // TODO: In the future, response rate (Taux de réponse) will be calculated dynamically from the chat/messages database collection based on the owner's response time to incoming student messages.
          responseRate: '100%',
          email: 'nourdine@gmail.com',
          phone: '+216 98 123 789',
          personalInfo: [
            { label: 'Type de compte', value: 'Bailleur Certifié' },
            { label: 'Taux de réponse', value: '100% (Répond généralement en moins d\'une heure)' },
            { label: 'Logements actifs', value: '2 annonces publiées' },
            { label: 'Membre depuis', value: '2022' },
          ],
          interests: ['Immobilier', 'Gestion locative', 'Rénovation'],
          recentActivity: [
            { title: 'S+3 Colocation El Menzah 5', subtitle: 'Annonce active', time: 'En ligne', type: 'search' },
          ]
        };
    }
  };

  React.useEffect(() => {
    requireAuth();

    if (!id) return;

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isMongoId) {
      setStudent(getStudentMock(id.toLowerCase()));
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`/auth/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            const user = data.user;
            const isOwner = user.role === 'owner';
            setStudent({
              name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Utilisateur Bity',
              avatar: user.avatar 
                ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) 
                : null,
              initials: user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')).toUpperCase() : 'B',
              status: isOwner ? 'Propriétaire Vérifié' : (user.is_verified ? 'Étudiant Vérifié' : 'Profil Régulier'),
              isOwner,
              trustScore: user.rankingScore || 4.9,
              reviewsCount: user.rankingCount || 18,
              // TODO: In the future, response rate (Taux de réponse) will be calculated dynamically from the chat/messages database collection based on the owner's response time to incoming student messages.
              responseRate: isOwner ? (user.responseRate || '100%') : undefined,
              email: user.email,
              phone: user.phone || '+216 98 123 789',
              personalInfo: [
                { label: 'Type de profil', value: isOwner ? 'Propriétaire Bailleur' : 'Étudiant / Colocataire' },
                ...(isOwner ? [{ label: 'Taux de réponse', value: `${user.responseRate || '100%'} (Répond généralement en moins d'une heure)` }] : []),
                { label: isOwner ? 'Statut' : 'Établissement', value: user.university || (isOwner ? 'Bailleur Certifié' : 'Université Sesame') },
                { label: 'Membre Bity', value: 'Compte Validé' }
              ],
              interests: user.interests && user.interests.length > 0 ? user.interests : (isOwner ? ['Immobilier', 'Gestion locative', 'Rénovation'] : ['Lecture', 'Cinéma', 'Coding']),
              recentActivity: [
                { title: isOwner ? 'S+3 Colocation El Menzah 5' : 'Recherche: Grand Tunis', subtitle: isOwner ? 'Annonce certifiée' : 'F2/F3 Proche Fac', time: 'Actif', type: 'search' },
                { title: 'Profil vérifié par l\'administrateur', subtitle: 'Documents validés', time: 'Certifié', type: 'visit' }
              ]
            });
            return;
          }
        }
        // Fallback to rich mock if user not found in DB
        setStudent(getStudentMock(id.toLowerCase()));
      } catch (error) {
        console.error('Error loading user profile:', error);
        setStudent(getStudentMock(id.toLowerCase()));
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-bold uppercase tracking-wider text-sm animate-pulse">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return <div className="p-10 text-center font-bold text-lg text-error">Profil non trouvé</div>;
  }

  const avatarColor = 'bg-secondary';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-bold text-sm bg-surface-container-lowest px-4 py-2 rounded-xl border border-outline-variant/20 ambient-shadow active:scale-95 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Retour</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN: Profile Card & Quick Actions ── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: User Summary Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 ambient-shadow flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-5">
              <div className="w-28 h-28 rounded-full border-4 border-surface-container-lowest shadow-xl overflow-hidden ring-2 ring-outline-variant/20 bg-surface-container flex items-center justify-center">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-display font-bold text-primary">
                    {student.initials || student.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3b82f6] rounded-full border-2 border-surface-container-lowest flex items-center justify-center text-white shadow-lg">
                <CheckCircle2 size={16} fill="currentColor" fillOpacity={0.2} />
              </div>
            </div>

            {/* User Name */}
            <h1 className="font-display text-2xl font-bold text-primary capitalize tracking-tight mb-2">
              {student.name}
            </h1>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <div className="inline-flex items-center gap-1.5 bg-[#eff6ff] text-[#1e40af] px-3.5 py-1.5 rounded-full border border-[#dbeafe] text-xs font-bold shadow-sm">
                <CheckCircle2 size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.2} />
                <span>{student.isOwner ? 'PROPRIÉTAIRE VÉRIFIÉ' : 'ÉTUDIANT VÉRIFIÉ'}</span>
              </div>
              {student.responseRate && (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold">
                  <MessageSquare size={13} className="text-emerald-600" />
                  <span>Taux de réponse : {student.responseRate}</span>
                </div>
              )}
            </div>

            {/* Score de Confiance Box */}
            <div className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-0.5 text-left">
                  Score de confiance
                </span>
                <span className="font-display text-lg font-bold text-primary">
                  {student.trustScore.toFixed(1)} <span className="text-xs text-outline font-medium">/ 5</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#2563eb]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={15} 
                    fill={star <= Math.round(student.trustScore) ? "currentColor" : "none"} 
                    className={star <= Math.round(student.trustScore) ? "text-[#2563eb]" : "text-outline/40"} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Desktop Quick Actions Menu (Hidden on Mobile) */}
          <div className="hidden lg:block bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/20 ambient-shadow space-y-2">
            <button
              onClick={() => navigate(student.isOwner ? `/messages/${id || 'owner'}/property` : '/messages')}
              className="w-full bg-[#1d4ed8] text-white p-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-between hover:bg-blue-700 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                <span>Contacter en messagerie</span>
              </div>
              <ChevronRight size={16} className="text-white/80" />
            </button>

            <button
              onClick={() => navigate('/review')}
              className="w-full bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Star size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Évaluer ce profil</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </button>

            <button
              onClick={() => alert("Profil signalé à la modération.")}
              className="w-full bg-white p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:bg-error/5 hover:border-error/30 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="font-bold text-sm text-error">Signaler le profil</span>
              </div>
              <ChevronRight size={16} className="text-error/40 group-hover:text-error transition-colors" />
            </button>
          </div>

        </div>

        {/* ── RIGHT COLUMN: Stats, Personal Info & Activity ── */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Row: 3 Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stat 1: Logements */}
            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/20 ambient-shadow flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{student.isOwner ? '🏠' : '🎓'}</span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  {student.isOwner ? 'Logements Actifs' : 'Statut Étudiant'}
                </span>
              </div>
              <span className="font-display text-2xl font-bold text-primary">
                {student.isOwner ? '2 Actifs' : 'Inscrit & Validé'}
              </span>
            </div>

            {/* Stat 2: Taux de réponse / Fiabilité */}
            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/20 ambient-shadow flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{student.isOwner ? '💬' : '💖'}</span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  {student.isOwner ? 'Taux de réponse' : 'Engagement'}
                </span>
              </div>
              <span className="font-display text-2xl font-bold text-primary">
                {student.isOwner ? (student.responseRate || '100%') : 'Actif 2026'}
              </span>
            </div>

            {/* Stat 3: Avis Reçus */}
            <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/20 ambient-shadow flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">⭐</span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                  Avis Reçus
                </span>
              </div>
              <span className="font-display text-2xl font-bold text-primary">
                {student.reviewsCount} avis
              </span>
            </div>
          </div>

          {/* Middle Card: Informations Personnelles */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 ambient-shadow space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-primary">
                Informations Personnelles
              </h2>
              <span className="text-xs font-bold text-[#1d4ed8] bg-[#eff6ff] border border-[#dbeafe] px-3 py-1 rounded-full uppercase tracking-wider">
                Profil Vérifié
              </span>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.personalInfo.map((info: any, i: number) => (
                  <div key={i} className="space-y-1.5">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      {info.label}
                    </span>
                    <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary">
                      {info.value}
                    </div>
                  </div>
                ))}

                {/* E-mail */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    E-mail
                  </span>
                  <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary truncate">
                    {student.email}
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                    Téléphone
                  </span>
                  <div className="bg-surface-container-low border border-outline-variant/15 rounded-2xl px-5 py-3.5 text-sm font-bold text-primary">
                    {student.phone}
                  </div>
                </div>
              </div>

              {/* Centres d'intérêt */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                  Centres d'intérêt
                </span>
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest: string) => (
                    <span
                      key={interest}
                      className="bg-[#eff6ff] text-[#1d4ed8] border border-[#dbeafe] px-4 py-1.5 rounded-full text-xs font-bold capitalize"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Activités récentes */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-primary">
              Activité Récente
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.recentActivity.map((activity: any, i: number) => (
                <div key={i} className="bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/20 ambient-shadow flex items-center gap-4 hover:border-secondary/40 transition-colors">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center text-secondary">
                    {activity.type === 'search' ? <Home size={24} /> : <Calendar size={24} />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">
                      {activity.title}
                    </span>
                    <h4 className="font-display font-bold text-sm text-primary truncate">
                      {activity.subtitle}
                    </h4>
                    <span className="text-xs text-outline font-medium flex items-center gap-1 mt-0.5">
                      <ClockIcon size={12} /> {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MOBILE BOTTOM ACTION MENU (Visible only on mobile screens < lg) ── */}
          <div className="block lg:hidden mt-8 space-y-2">
            <h3 className="font-display font-bold text-lg text-primary mb-3">
              Actions rapides
            </h3>
            
            <button
              onClick={() => navigate(student.isOwner ? `/messages/${id || 'owner'}/property` : '/messages')}
              className="w-full bg-[#1d4ed8] text-white p-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-between hover:bg-blue-700 active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} />
                <span>Contacter en messagerie</span>
              </div>
              <ChevronRight size={16} className="text-white/80" />
            </button>

            <button
              onClick={() => navigate('/review')}
              className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:shadow-sm hover:border-secondary/40 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#eff6ff] text-[#3b82f6] flex items-center justify-center">
                  <Star size={18} />
                </div>
                <span className="font-bold text-sm text-primary">Évaluer ce profil</span>
              </div>
              <ChevronRight size={16} className="text-outline group-hover:text-secondary transition-colors" />
            </button>

            <button
              onClick={() => alert("Profil signalé à la modération.")}
              className="w-full bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20 flex items-center justify-between group hover:bg-error/5 hover:border-error/30 transition-all text-left"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-error/10 text-error flex items-center justify-center">
                  <Shield size={18} />
                </div>
                <span className="font-bold text-sm text-error">Signaler le profil</span>
              </div>
              <ChevronRight size={16} className="text-error/40 group-hover:text-error transition-colors" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
