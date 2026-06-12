import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import React, { useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

// Role → frontend port mapping (matches backend redirectUrl)
const ROLE_PORTS: Record<string, string> = {
  student:  'http://localhost:3001',
  owner:    'http://localhost:3002',
  admin:    'http://localhost:3003',
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('L\'adresse e-mail est requise.'); return; }
    if (!password.trim()) { setError('Le mot de passe est requis.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Identifiants incorrects.');
        setLoading(false);
        return;
      }

      // Persist session
      localStorage.setItem('bity_token', json.token);
      localStorage.setItem('bity_user', JSON.stringify(json.user));

      // Redirect based on role
      const destination = ROLE_PORTS[json.user.role];
      if (destination) {
        // Cross-origin navigation to the correct frontend port, passing token & user as query parameters
        window.location.href = `${destination}?token=${encodeURIComponent(json.token)}&user=${encodeURIComponent(JSON.stringify(json.user))}`;
      } else {
        navigate('/dashboard');
      }
    } catch {
      setError('Impossible de joindre le serveur. Assurez-vous que le backend est démarré (port 5000).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm glass-panel premium-shadow rounded-2xl p-8 border border-outline-variant/30"
      >
        <div className="flex justify-center mb-6">
          <h1 className="font-display text-4xl font-bold text-secondary tracking-tight">bity</h1>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-on-tertiary-container/10 text-on-tertiary-container px-4 py-2 rounded-full border border-on-tertiary-container/20">
            <ShieldCheck className="w-4 h-4 fill-on-tertiary-container/20" />
            <span className="text-xs font-semibold tracking-wide">100% des profils sont vérifiés</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="font-display text-2xl font-semibold text-on-surface mb-1">Accès Sécurisé</h2>
          <p className="text-on-surface-variant">Renseignez vos identifiants pour continuer</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="email">Adresse e-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="password">Mot de passe</label>
              <button type="button" className="text-xs font-semibold text-secondary hover:underline">Oublié ?</button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); if (error) setError(''); }}
                className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-error/5 border border-error/20 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <p className="text-xs text-error font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-on-secondary rounded-xl py-3 mt-2 font-semibold hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Connexion...</>
            ) : (
              <>Se connecter <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-on-surface-variant">
          Nouveau sur bity ?{' '}
          <button onClick={() => navigate('/profiles')} className="text-secondary font-bold hover:underline">
            Créer un profil
          </button>
        </p>
      </motion.div>
    </div>
  );
}
