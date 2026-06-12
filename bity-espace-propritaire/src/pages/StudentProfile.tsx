import React from 'react';
import { Layout } from '../components/Layout';
import { BadgeCheck, Star, GraduationCap, MapPin, History, ChevronRight, UserCircle, MessageSquare, Heart, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-on-surface p-2 -ml-2 hover:bg-surface-container rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="w-10"></div> {/* Spacer for symmetry if needed, or just let the back button stick to the left */}
        </div>

        {/* Profile Hero */}
        <section className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-surface-container-highest">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                alt="Ahmed Hamza" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#3b82f6] rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
              <BadgeCheck size={18} fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-2">Ahmed Hamza</h1>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-[#eff6ff] text-[#1e40af] px-3 py-1 rounded-full border border-[#dbeafe]">
              <GraduationCap size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.2} />
              <span className="text-[11px] font-bold uppercase tracking-tight">Étudiant Vérifié</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fefce8] text-[#854d0e] px-3 py-1 rounded-full border border-[#fef9c3]">
              <Star size={14} className="text-[#eab308]" fill="currentColor" />
              <span className="text-[11px] font-bold">4.8/5 Trust Score</span>
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
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Établissement</label>
              <div className="bg-surface-container-low border border-surface-container rounded-2xl p-4 font-bold text-primary shadow-sm">
                Université Sesame
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Niveau d'études</label>
              <div className="bg-surface-container-low border border-surface-container rounded-2xl p-4 font-bold text-primary shadow-sm">
                4e année Ingénieur
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Statut</label>
              <div className="bg-surface-container-low border border-surface-container rounded-2xl p-4 font-bold text-primary shadow-sm">
                Non-fumeur
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Recherche active</label>
              <div className="bg-surface-container-low border border-surface-container rounded-2xl p-4 font-bold text-primary shadow-sm">
                Tunis / La Marsa
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Passions & Loisirs</label>
            <div className="flex flex-wrap gap-2">
              {['Football', 'E-sport', 'Musique', 'Voyages'].map(tag => (
                <span key={tag} className="bg-secondary/5 text-secondary border border-secondary/20 px-5 py-2.5 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity (Search History) */}
        <section className="bg-white rounded-3xl p-8 border border-surface-container-highest shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <History className="text-secondary" size={24} strokeWidth={2.5} />
              <h2 className="text-xl font-bold text-primary">Activité Récente</h2>
            </div>
            <button className="text-secondary text-xs font-bold hover:underline">Voir Tout</button>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Recherche: Tunis Centre', date: 'Il y a 2 jours', icon: MapPin },
              { title: 'Demande de visite: La Marsa', date: 'Il y a 1 semaine', icon: Heart }
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-surface-container rounded-2xl hover:bg-surface-container-low transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:bg-secondary/10 transition-colors">
                  <activity.icon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-primary">{activity.title}</h4>
                  <p className="text-[11px] text-on-surface-variant font-medium">{activity.date}</p>
                </div>
                <ChevronRight size={18} className="text-on-surface-variant/30" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default StudentProfile;
