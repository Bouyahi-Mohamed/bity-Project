import React, { useState } from 'react';
import { CheckCircle, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'motion/react';
import { useSignup } from '../context/SignupContext';

const API_BASE = 'http://localhost:5000/api';

export default function PersonalDetails() {
  const navigate = useNavigate();
  const { data, setField, reset } = useSignup();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(data.email);
  const [password, setPassword] = useState(data.password);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('fr');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setError('Prénom, nom, email et mot de passe sont obligatoires.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!data.role) {
      setError('Rôle manquant. Veuillez recommencer depuis le début.');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('email', email.trim());
      form.append('password', password);
      form.append('firstName', firstName.trim());
      form.append('lastName', lastName.trim());
      form.append('username', username.trim() || email.split('@')[0]);
      form.append('phone', phone.trim());
      form.append('language', language);
      form.append('role', data.role);

      if (data.role === 'student') {
        form.append('university', data.university);
        if (data.studentCardFile) form.append('studentCardImage', data.studentCardFile);
      } else if (data.role === 'owner') {
        if (data.cinFile) form.append('cinImage', data.cinFile);
        if (data.utilityBillFile) form.append('utilityBillImage', data.utilityBillFile);
      }

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Une erreur est survenue lors de l\'inscription.');
        setLoading(false);
        return;
      }

      // Save token and user info locally
      localStorage.setItem('bity_token', json.token || '');
      localStorage.setItem('bity_user', JSON.stringify(json.user));

      reset(); // Clear signup context

      // Show success then navigate to dashboard (pending admin verification)
      navigate('/dashboard');
    } catch (err: any) {
      setError('Impossible de joindre le serveur. Assurez-vous que le backend est démarré (port 5000).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showBack>
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-12 h-1 bg-secondary rounded-full"></div>
            ))}
          </div>
          <h1 className="text-3xl font-display font-semibold text-on-surface">Détails Personnels</h1>
          <p className="text-on-surface-variant">Dernière étape ! Créez vos identifiants de connexion.</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 premium-shadow relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="firstName">Prénom</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Entrez votre prénom"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="bg-surface-bright border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="lastName">Nom</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Entrez votre nom"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="bg-surface-bright border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-surface-bright border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••  (min. 6 caractères)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="bg-surface-bright border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="username">Nom d'utilisateur</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 font-medium">@</span>
                <input
                  id="username"
                  type="text"
                  placeholder="votre_pseudo"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-surface-bright border border-outline-variant/40 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="phone">Numéro de téléphone</label>
              <div className="flex">
                <div className="bg-surface-container-low border border-outline-variant/40 border-r-0 rounded-l-xl px-4 py-3 flex items-center justify-center text-on-surface-variant font-medium">
                  +216
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="22 123 456"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-surface-bright border border-outline-variant/40 rounded-r-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant ml-1" htmlFor="language">Langue Préférée</label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full appearance-none bg-surface-bright border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all cursor-pointer"
                >
                  <option value="fr">Français</option>
                  <option value="ar">Arabe</option>
                  <option value="en">Anglais</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-error/5 border border-error/20 rounded-xl p-4">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error font-medium">{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-4 mt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-semibold uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Création du compte...</>
                ) : (
                  <>Terminer la vérification <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /></>
                )}
              </motion.button>
              <p className="text-center text-xs font-semibold text-on-surface-variant">
                En terminant, vous acceptez nos <button type="button" className="text-secondary hover:underline">Conditions d'utilisation</button>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
