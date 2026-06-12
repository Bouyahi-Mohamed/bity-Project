import React from 'react';
import { Layout } from '../components/Layout';
import { Search, Star, ShieldCheck, ArrowLeft, UserCheck, Eye, MessageSquare, Info, Smartphone, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const SearchReview = () => {
  const navigate = useNavigate();
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(-1)} className="text-secondary p-2 -ml-2">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-secondary">Évaluer & Info</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Ahmed Hamza"
            className="w-full pl-14 pr-6 py-4 bg-white border border-surface-container-highest rounded-2xl shadow-sm focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all font-medium text-lg text-primary placeholder:text-primary"
            defaultValue="Ahmed Hamza"
          />
        </div>

        {/* Tab Selector */}
        <div className="p-1 bg-surface-container-low rounded-2xl flex border border-surface-container">
          <button className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl bg-white shadow-sm text-secondary transition-all">Colocataire</button>
          <button className="flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-xl text-on-surface-variant hover:bg-white/50 transition-all">Propriétaire</button>
        </div>

        {/* Search Results */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Résultats de recherche</h3>
          <div className="space-y-3">
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate('/student/ahmed')}
              className="w-full flex items-center gap-4 p-4 bg-[#eff6ff] border-2 border-[#3b82f6] rounded-2xl text-left relative cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border border-surface-container shrink-0">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-primary">Ahmed Hamza</h4>
                <p className="text-[13px] text-on-surface-variant font-medium">Colocataire à Tunis • <span className="text-[#3b82f6] font-bold">Voir plus</span></p>
              </div>
              <div className="bg-[#3b82f6] text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                <CheckCircle2 size={16} fill="currentColor" fillOpacity={0.4} />
              </div>
            </motion.div>

            <div className="w-full flex items-center gap-4 p-4 bg-white border border-surface-container rounded-2xl text-left hover:border-secondary/30 transition-all group cursor-pointer opacity-90">
               <div className="w-14 h-14 rounded-full overflow-hidden border border-surface-container shrink-0">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-primary">Ahmed Hamza Belhadj</h4>
                <p className="text-[13px] text-on-surface-variant font-medium">Colocataire à La Marsa</p>
              </div>
              <ArrowLeft size={18} className="text-on-surface-variant/30 rotate-180" />
            </div>

            <div className="w-full flex items-center gap-4 p-4 bg-white border border-surface-container rounded-xl text-left hover:border-secondary/30 transition-all opacity-90">
               <div className="w-14 h-14 rounded-full overflow-hidden border border-surface-container shrink-0">
                <img src="https://images.unsplash.com/photo-1542103749-8ef59b94f47e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover grayscale-[0.3]" alt="" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-primary">Ahmed Hamza Jr.</h4>
                <p className="text-[13px] text-on-surface-variant font-medium">Colocataire à Sousse</p>
              </div>
              <ArrowLeft size={18} className="text-on-surface-variant/30 rotate-180" />
            </div>
          </div>
        </section>

        {/* Profile Stats Card */}
        <section className="bg-[#f2f4f6]/50 rounded-3xl p-6 border border-surface-container-highest space-y-6">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/student/ahmed')}>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-primary">Ahmed Hamza</h4>
              <p className="text-[11px] text-on-surface-variant font-medium uppercase tracking-tighter">Membre depuis 2022</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-surface-container shadow-sm">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Score de confiance</p>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#3b82f6]" fill="currentColor" fillOpacity={0.1} />
                <span className="text-lg font-bold text-primary">4.8/5</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-surface-container shadow-sm">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Activité</p>
              <div className="flex items-center gap-1.5">
                <MessageSquare size={14} className="text-[#3b82f6]" strokeWidth={2.5} />
                <span className="text-lg font-bold text-primary">15 avis vérifiés</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/student/ahmed')}
            className="w-full py-3.5 border-2 border-[#3b82f6] text-[#3b82f6] font-bold text-[11px] uppercase tracking-widest rounded-xl px-4 flex items-center justify-center gap-2 hover:bg-[#3b82f6]/5 transition-all active:scale-[0.98]"
          >
            <Eye size={18} strokeWidth={2.5} /> Voir le profil complet
          </button>
        </section>

        {/* Rating Section */}
        <section className="bg-white rounded-[32px] p-8 border border-surface-container-highest shadow-sm flex flex-col items-center gap-6">
          <h3 className="text-xl font-bold text-primary mt-2">Noter Ahmed Hamza</h3>
          
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
          
          <p className="text-sm font-medium text-on-surface-variant mb-2">Appuyez pour noter</p>

          <div className="w-full space-y-2 text-left">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Rédigez votre avis</label>
            <textarea 
              rows={6}
              placeholder="Décrivez votre expérience avec Ahmed Hamza..."
              className="w-full bg-surface-container-low/30 border border-surface-container-highest rounded-2xl p-6 text-on-surface font-medium focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none shadow-inner"
            />
          </div>

          <button className="w-full bg-[#0051d5] text-white font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-secondary/20 hover:bg-[#0041ab] transition-all active:scale-[0.98]">
            Envoyer l'avis
          </button>
        </section>
      </div>
    </Layout>
  );
};

export default SearchReview;
