import React from 'react';
import { Layout } from '../components/Layout';
import { BadgeCheck, Star, Info, Settings, Shield, LogOut, ChevronRight, Briefcase, History, Home, Calendar, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { requireAuth, getUser } from '../lib/api';

const Profile = () => {
  // Protect route
  requireAuth();

  const user = getUser();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('bity_token');
    localStorage.removeItem('bity_user');
    window.location.href = 'http://localhost:3000';
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Alexander Wright';
  const trustScore = user?.rankingScore || 4.8;
  const reviewsCount = user?.rankingCount || 12;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
        {/* Avatar Section */}
        <section className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-surface-container-highest flex items-center justify-center bg-secondary text-white text-3xl font-bold uppercase shadow-inner">
              {user?.firstName ? user.firstName[0] + user.lastName[0] : 'AW'}
            </div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#3b82f6] rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg">
              <BadgeCheck size={18} fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-primary mb-3">{fullName}</h1>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 bg-[#eff6ff] text-[#1e40af] px-3 py-1.5 rounded-full border border-[#dbeafe]">
              <BadgeCheck size={14} fill="currentColor" fillOpacity={0.2} />
              <span className="text-[11px] font-bold">Propriétaire Certifié</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#fefce8] text-[#854d0e] px-3 py-1.5 rounded-full border border-[#fef9c3]">
              <Star size={14} className="text-[#eab308]" fill="currentColor" />
              <span className="text-[11px] font-bold">{trustScore}/5 Score de Fiabilité</span>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="w-full bg-white rounded-3xl p-6 border border-surface-container-highest shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="text-secondary" size={24} />
            <h2 className="text-xl font-bold text-primary">Informations Personnelles</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <Mail size={12} className="text-secondary" /> Adresse E-mail
              </label>
              <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                {user?.email || 'alexander.wright@company.com'}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                <Phone size={12} className="text-secondary" /> Numéro de Téléphone
              </label>
              <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                {user?.phone || '+216 22 123 456'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Nombre de Propriétés</label>
                <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                  {reviewsCount > 5 ? Math.floor(reviewsCount / 2) : 2} active(s)
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Type de Propriétaire</label>
                <div className="bg-surface-container-low border border-surface-container rounded-xl p-4 font-medium text-primary shadow-sm">
                  Professionnel
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant">Intérêts</label>
              <div className="flex flex-wrap gap-2">
                {['Immobilier', 'Architecture', 'Colocation Étudiante'].map(interest => (
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
              <History className="text-secondary" size={24} />
              <h2 className="text-xl font-bold text-primary">Activité Récente</h2>
            </div>
            <button className="text-secondary text-xs font-bold hover:underline">Voir Tout</button>
          </div>

          <div className="space-y-6 relative ml-4">
            {/* Timeline Line */}
            <div className="absolute top-2 bottom-2 left-4 w-px bg-surface-container-highest -translate-x-1/2" />
            
            <div className="flex gap-4 relative">
              <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center text-secondary relative z-10 shrink-0 border-2 border-white shadow-sm">
                <Home size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">Nouvelle annonce créée</h4>
                <p className="text-xs text-on-surface-variant font-medium">Logement Moderne de Standing</p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-8 h-8 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#7c3aed] relative z-10 shrink-0 border-2 border-white shadow-sm">
                <Calendar size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">Visite planifiée</h4>
                <p className="text-xs text-on-surface-variant font-medium">Studio Proche INSAT</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action List */}
        <section className="w-full space-y-3">
          {[
            { icon: Info, label: 'Évaluer & Info', color: 'text-[#3b82f6]', path: '/search' },
            { icon: Settings, label: 'Tableau de bord statistique', color: 'text-[#3b82f6]', path: '/analytics' },
            { icon: Shield, label: 'Centre de Sécurité', color: 'text-[#3b82f6]', path: '/' },
            { icon: LogOut, label: 'Se Déconnecter', color: 'text-error', isLogout: true, path: '#' }
          ].map((item, i) => (
            <Link 
              key={i}
              to={item.path}
              onClick={item.isLogout ? handleLogout : undefined}
              className="w-full bg-white p-5 rounded-2xl border border-surface-container-highest flex items-center justify-between group hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.isLogout ? 'bg-error/10' : 'bg-[#eff6ff]'} ${item.color}`}>
                  <item.icon size={20} />
                </div>
                <span className={`font-bold tracking-tight ${item.isLogout ? 'text-error' : 'text-primary'}`}>{item.label}</span>
              </div>
              {!item.isLogout && (
                <ChevronRight size={20} className="text-on-surface-variant/30 group-hover:text-secondary transition-colors" />
              )}
            </Link>
          ))}
        </section>
      </div>
    </Layout>
  );
};

export default Profile;
