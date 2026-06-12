import React from 'react';
import { Layout } from '../components/Layout';
import { MOCK_NOTIFICATIONS } from '../constants';
import { AlertCircle, Calendar, FileText, Heart, ShieldAlert, Eye } from 'lucide-react';
import { motion } from 'motion/react';

const Notifications = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-primary">Activité</h1>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['Toutes', 'Urgentes', 'Demandes', 'Système'].map((label, i) => (
            <button 
              key={label}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${i === 0 ? 'bg-secondary text-white shadow-md shadow-secondary/20' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-8">
          {/* Urgent Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-error" />
              <span className="text-[10px] font-bold text-error uppercase tracking-widest">Action Requise</span>
            </div>
            
            {MOCK_NOTIFICATIONS.filter(n => n.type === 'urgent').map(notification => (
              <motion.div 
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-error-container shadow-sm p-5 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-error" />
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-error-container/30 flex items-center justify-center shrink-0">
                    <ShieldAlert size={24} className="text-error" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-primary">{notification.title}</h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{notification.description}</p>
                    <div className="pt-4 flex justify-end">
                      <button className="bg-secondary text-white px-5 py-2 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all">
                        {notification.actionLabel}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Today Section */}
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-1">Aujourd'hui</span>
            
            <div className="bg-white rounded-2xl border border-surface-container-highest shadow-sm p-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <Calendar size={24} className="text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-primary">Rappel de visite</h3>
                  <span className="text-[10px] text-on-surface-variant/60 font-bold">À l'instant</span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Votre visite avec Nour Chatti est prévue pour aujourd'hui à 14:00.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-container-highest shadow-sm p-5 flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                  <Heart size={24} className="text-error" fill="currentColor" fillOpacity={0.1} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-primary">Nouveau favori</h3>
                    <span className="text-[10px] text-on-surface-variant/60 font-bold">2h</span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1">Un étudiant a ajouté votre annonce "S+2 Moderne" à ses favoris.</p>
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-surface-container">
                <button className="flex items-center gap-2 text-secondary text-xs font-bold hover:underline">
                  <Eye size={14} /> Voir l'annonce
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
