import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Star, Shield, 
  MessageSquare, Clock as ClockIcon, ChevronRight,
  Mail, Phone, GraduationCap, Heart, Calendar, ShieldCheck
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
      default:
        return {
          name: 'Ahmed Hamza',
          avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&q=80&w=400',
          status: 'Verified Student',
          trustScore: 4.8,
          reviewsCount: 15,
          email: 'ahmed.hamza@sesame.com',
          phone: '+216 22 999 888',
          personalInfo: [
            { label: 'Établissement', value: 'Université Sesame' },
            { label: 'Niveau', value: '4e année Ingénieur' },
            { label: 'Statut', value: 'Non-fumeur' },
          ],
          interests: ['Football', 'Danse', 'Théâtre', 'E-sport'],
          recentActivity: [
            { title: 'Recherche: Tunis Centre', subtitle: 'Appartement F3', time: 'Il y a 2 jours', type: 'search' },
            { title: 'Demande de visite: La Marsa', subtitle: 'Studio Étudiant', time: 'Il y a 1 semaine', type: 'visit' },
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
                : null,
              initials: user.firstName ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'B',
              status: user.is_verified ? 'Étudiant Vérifié' : 'Profil Régulier',
              trustScore: user.rankingScore || 5.0,
              reviewsCount: user.rankingCount || 0,
              email: user.email,
              phone: user.phone || 'Non partagé',
              personalInfo: [
                { label: 'Établissement', value: user.university || 'Université Sesame' },
                { label: 'Niveau d\'études', value: user.role === 'student' ? 'Colocataire / Étudiant' : 'Propriétaire' },
                { label: 'Statut', value: 'Membre Bity' }
              ],
              interests: user.interests && user.interests.length > 0 ? user.interests : ['Lecture', 'Cinéma', 'Coding', 'Musique'],
              recentActivity: [
                { title: 'Recherche: Grand Tunis', subtitle: 'F2/F3 Proche Fac', time: 'Il y a 2 jours', type: 'search' },
                { title: 'Visite planifiée', subtitle: 'Logement Certifié', time: 'Il y a 5 jours', type: 'visit' }
              ]
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

  const avatarColor = 'bg-secondary';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 pt-3 pb-32 flex flex-col items-center gap-6">
        
        {/* Back Button */}
        <div className="w-full flex items-center mb-1">
          <button 
            onClick={() => navigate(-1)} 
            className="text-[#3b82f6] p-2 -ml-2 hover:bg-surface-container rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Profile Hero / Avatar Section */}
        <section className="flex flex-col items-center">
          <div className="relative mb-6">
            {student.avatar ? (
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-surface-container-highest">
                <img 
                  src={student.avatar} 
                  alt={student.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className={`w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-surface-container-highest flex items-center justify-center ${avatarColor} text-white text-3xl font-bold uppercase shadow-inner`}>
                {student.initials || student.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3b82f6] rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
              <CheckCircle2 size={18} fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-3">{student.name}</h1>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-[#eff6ff] text-[#1e40af] px-3 py-1.5 rounded-full border border-[#dbeafe]">
              <GraduationCap size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.2} />
              <span className="text-[11px] font-bold">{student.status}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fefce8] text-[#854d0e] px-3 py-1.5 rounded-full border border-[#fef9c3]">
              <Star size={14} className="text-[#eab308]" fill="currentColor" />
              <span className="text-[11px] font-bold">{student.trustScore.toFixed(1)}/5 Trust Score</span>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="w-full bg-white rounded-3xl p-6 border border-surface-container-highest shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="text-secondary" size={24} />
            <h2 className="text-xl font-bold text-primary">Informations Personnelles</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <Mail size={12} className="text-secondary" /> Adresse E-mail
              </label>
              <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                {student.email}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <Phone size={12} className="text-secondary" /> Numéro de Téléphone
              </label>
              <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                {student.phone}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.personalInfo.map((info: any, i: number) => (
                <div key={i} className="space-y-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">{info.label}</label>
                  <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                    {info.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant">Centres d'intérêt</label>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest: string) => (
                  <span key={interest} className="bg-secondary/10 text-secondary border border-secondary/20 px-4 py-2 rounded-full text-xs font-bold">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="w-full bg-white rounded-3xl p-6 border border-surface-container-highest shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ClockIcon className="text-secondary" size={24} />
              <h2 className="text-xl font-bold text-primary">Activité Récente</h2>
            </div>
            <button className="text-secondary text-xs font-bold hover:underline">Voir Tout</button>
          </div>

          <div className="space-y-6 relative ml-4">
            {/* Timeline Line */}
            <div className="absolute top-2 bottom-2 left-4 w-px bg-surface-container-highest -translate-x-1/2" />
            
            {student.recentActivity.map((activity: any, i: number) => (
              <div key={i} className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-secondary relative z-10 shrink-0 border-2 border-white shadow-sm">
                  {activity.type === 'search' ? <GraduationCap size={16} /> : <Calendar size={16} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">{activity.title}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">{activity.subtitle} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
