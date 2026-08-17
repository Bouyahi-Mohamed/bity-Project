import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Star, GraduationCap, Clock, ChevronRight, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch, requireAuth } from '../lib/api';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requireAuth();

    if (!id) return;

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
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            <p className="text-on-surface-variant font-bold uppercase tracking-wider text-sm animate-pulse">Chargement du profil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="p-10 text-center font-bold text-lg text-error">Profil non trouvé</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-on-surface p-2 -ml-2 hover:bg-surface-container rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-10"></div>
        </div>

        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-surface-container-highest">
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

          <h1 className="text-3xl font-bold text-primary mb-2 mt-2">{student.name}</h1>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-[#eff6ff] text-[#1e40af] px-3 py-1 rounded-full border border-[#dbeafe]">
              <GraduationCap size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.2} />
              <span className="text-[11px] font-bold uppercase tracking-tight">Étudiant Vérifié</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fefce8] text-[#854d0e] px-3 py-1 rounded-full border border-[#fef9c3]">
              <Star size={14} className="text-[#eab308]" fill="currentColor" />
              <span className="text-[11px] font-bold">{student.trustScore.toFixed(1)}/5 Trust Score</span>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="bg-white rounded-3xl p-8 border border-surface-container-highest shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-secondary" size={24} strokeWidth={2.5} />
            <h2 className="text-xl font-bold text-primary">Informations Personnelles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.personalInfo.map((info: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">{info.label}</label>
                <div className="bg-surface-container-low border border-surface-container rounded-2xl p-4 font-bold text-primary shadow-sm">
                  {info.value}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Passions &amp; Loisirs</label>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((tag: string) => (
                <span key={tag} className="bg-secondary/5 text-secondary border border-secondary/20 px-5 py-2.5 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default StudentProfile;
