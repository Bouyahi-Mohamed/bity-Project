import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ShieldCheck, LogOut, Clock, CheckCircle2, GraduationCap, Landmark, AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const raw = localStorage.getItem('bity_user');
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = () => {
    localStorage.removeItem('bity_token');
    localStorage.removeItem('bity_user');
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const isStudent = user.role === 'student';
  const isOwner = user.role === 'owner';
  const roleLabel = isStudent ? 'Étudiant' : 'Propriétaire';
  const RoleIcon = isStudent ? GraduationCap : Landmark;

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-hidden pb-12">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="bg-surface-container-lowest/70 backdrop-blur-xl border-b border-outline-variant/20 sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-bold text-secondary tracking-tight">bity</span>
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-2.5 py-1 rounded-full border border-secondary/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Réseau Sécurisé
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="p-2 text-outline hover:text-error hover:bg-error/10 rounded-full transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8 relative z-10 items-center justify-center">

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 premium-shadow flex flex-col items-center gap-6 text-center"
        >
          {/* Role Icon */}
          <div className="w-20 h-20 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <RoleIcon className="w-10 h-10 text-secondary" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">{roleLabel}</p>
            <h2 className="text-2xl font-bold text-on-surface mb-1">
              Bienvenue, {user.firstName || user.email} !
            </h2>
            <p className="text-on-surface-variant text-sm">
              Votre compte a été créé avec succès.
            </p>
          </div>

          {/* Pending verification banner */}
          <div className="w-full flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Vérification en attente</h3>
              <p className="text-sm text-amber-700 leading-relaxed">
                Vos documents ont été soumis et sont en cours d'examen par notre équipe de modération. 
                Vous recevrez une notification dès que votre compte sera approuvé.
              </p>
            </div>
          </div>

          {/* What happens next */}
          <div className="w-full flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Prochaines étapes</p>
            {[
              { label: 'Documents soumis', done: true },
              { label: 'Examen par l\'administrateur', done: false },
              { label: isStudent ? 'Accès à l\'espace étudiant' : 'Accès à l\'espace propriétaire', done: false },
            ].map((step, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${step.done ? 'bg-emerald-50 border-emerald-200' : 'bg-surface-container-low border-outline-variant/20'}`}>
                {step.done
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  : <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex-shrink-0" />
                }
                <span className={`text-sm font-semibold ${step.done ? 'text-emerald-700' : 'text-on-surface-variant'}`}>{step.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Alert info */}
        <div className="flex items-start gap-3 bg-secondary/5 border border-secondary/20 rounded-2xl p-4 w-full">
          <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-secondary font-medium leading-relaxed">
            Une fois approuvé, connectez-vous à nouveau sur <strong>localhost:3000</strong> pour accéder à votre espace dédié.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-on-surface-variant text-sm font-semibold hover:text-error transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Se déconnecter
        </button>
      </main>
    </div>
  );
}
