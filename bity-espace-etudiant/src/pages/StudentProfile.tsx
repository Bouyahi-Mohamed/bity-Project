import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Star, Shield, 
  MessageSquare, Clock as ClockIcon, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
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
          personalInfo: [
            { label: 'Établissement', value: 'INSAT Tunis' },
            { label: 'Niveau', value: '3e année Génie Logiciel' },
            { label: 'Statut', value: 'Non-fumeuse' },
          ],
          interests: ['Lecture', 'Cinéma', 'Coding', 'Musique'],
          recentActivity: [
            { title: 'Ariana Centre', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200', time: 'Il y a 1 jour' },
            { title: 'Charguia 2', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=200', time: 'Il y a 4 jours' },
          ]
        };
      case 'farah':
        return {
          name: 'Farah',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.7,
          reviewsCount: 11,
          personalInfo: [
            { label: 'Établissement', value: 'ESPRIT Tunis' },
            { label: 'Niveau', value: '2e année Informatique' },
            { label: 'Statut', value: 'Calme & Studieuse' },
          ],
          interests: ['Design', 'Photographie', 'Randonnée', 'Séries'],
          recentActivity: [
            { title: 'Ghazela District', img: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=200', time: 'Il y a 3 jours' },
          ]
        };
      case 'hend':
        return {
          name: 'Hend',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.8,
          reviewsCount: 14,
          personalInfo: [
            { label: 'Établissement', value: 'FSEGT Tunis' },
            { label: 'Niveau', value: 'Master Économie' },
            { label: 'Statut', value: 'Aime cuisiner' },
          ],
          interests: ['Cuisine', 'Yoga', 'Lecture', 'Café'],
          recentActivity: [
            { title: 'El Menzah 5', img: 'https://images.unsplash.com/photo-1536376074432-bc12f744586c?auto=format&fit=crop&q=80&w=200', time: 'Il y a 5 jours' },
          ]
        };
      default:
        return {
          name: 'Ahmed Hamza',
          avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.8,
          reviewsCount: 15,
          personalInfo: [
            { label: 'Établissement', value: 'Université Sesame' },
            { label: 'Niveau', value: '4e année Ingénieur' },
            { label: 'Statut', value: 'Non-fumeur' },
          ],
          interests: ['Football', 'Danse', 'Théâtre', 'E-sport'],
          recentActivity: [
            { title: 'Tunis Centre', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=200', time: 'Il y a 2 jours' },
            { title: 'La Marsa', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=200', time: 'Il y a 1 semaine' },
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
            setStudent({
              name: `${user.firstName} ${user.lastName}`.trim() || user.username || 'Utilisateur Bity',
              avatar: user.avatar 
                ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) 
                : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
              status: user.is_verified ? 'Profil Vérifié' : 'Vérification en cours',
              trustScore: user.rankingScore || 5.0,
              reviewsCount: user.rankingCount || 0,
              personalInfo: [
                { label: 'Établissement', value: user.university || 'Université Sesame' },
                { label: 'Rôle', value: user.role === 'student' ? 'Étudiant' : user.role === 'owner' ? 'Propriétaire' : 'Admin' },
                { label: 'E-mail', value: user.email },
                { label: 'Téléphone', value: user.phone || 'Non partagé' }
              ],
              interests: user.interests && user.interests.length > 0 ? user.interests : (user.role === 'student' ? ['Lecture', 'Cinéma', 'Coding', 'Musique'] : ['Logements', 'Bity Club']),
              recentActivity: []
            });
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Profile Header for /student/:id */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-outline-variant/10 h-16 px-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-container active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6 text-secondary" />
        </button>
        <span className="font-display text-2xl font-bold text-secondary tracking-tight">bity</span>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
          <img 
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" 
            alt="My Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-32 space-y-12">
        {/* Profile Identity */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-4 ring-secondary/5">
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 right-0 left-0 flex justify-center">
              <div className="bg-secondary/10 backdrop-blur-md px-4 py-1.5 rounded-full ring-1 ring-secondary/20 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{student.status}</span>
              </div>
            </div>
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-8">
            {student.name}
          </h1>

          {/* Trust Box */}
          <div className="w-full bg-surface-container-lowest rounded-[32px] p-8 border border-outline-variant/30 ambient-shadow flex justify-between items-center">
            <div className="text-left">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2">Community Trust</p>
              <div className="font-display text-4xl font-bold flex items-baseline">
                {student.trustScore} <span className="text-on-surface-variant font-medium text-lg ml-2">/ 5</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex gap-0.5 text-secondary">
                {[1, 2, 3, 4].map(i => <Star key={i} className="w-6 h-6 fill-current shadow-lg shadow-secondary/10" />)}
                <Star className="w-6 h-6 text-on-surface-variant opacity-20" />
              </div>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Basé sur {student.reviewsCount} avis</span>
            </div>
          </div>
        </motion.section>

        {/* Personal Info */}
        <section className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-primary tracking-tight px-2">Informations Personnelles</h2>
          <div className="bg-surface-container-lowest rounded-[40px] p-10 border border-outline-variant/30 ambient-shadow space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {student.personalInfo.map((info, i) => (
                <div key={i} className="space-y-3">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.25em] ml-1">{info.label}</label>
                  <div className="w-full bg-surface-container-low/40 border border-outline-variant/20 rounded-2xl p-5 font-bold text-on-surface text-lg">
                    {info.value}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.25em] ml-1">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-3">
                {student.interests.map((tag, i) => (
                  <span key={i} className="bg-secondary/5 text-secondary border border-secondary/10 px-6 py-2.5 rounded-full font-bold text-sm tracking-tight hover:bg-secondary hover:text-white transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="space-y-6 pb-12">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-display text-2xl font-bold text-primary tracking-tight">Activités récentes</h2>
            <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">Voir tout</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.recentActivity.map((item, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/20 ambient-shadow flex gap-5 hover:-translate-y-1 transition-all cursor-pointer group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/10 shadow-sm">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-2 opacity-70">Recherche récente</p>
                  <p className="font-display text-xl font-bold text-on-surface group-hover:text-secondary transition-colors truncate">{item.title}</p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-outline-variant mt-2">
                    <ClockIcon className="w-3.5 h-3.5" /> {item.time}
                  </div>
                </div>
                <div className="ml-auto flex items-center pr-2">
                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-secondary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
