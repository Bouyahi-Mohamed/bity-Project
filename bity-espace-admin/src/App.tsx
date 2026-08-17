/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Search, 
  CalendarDays, 
  Settings, 
  Bell, 
  SearchIcon,
  Filter,
  CheckCircle2,
  Trash2,
  Mail,
  AlertTriangle,
  ArrowRight,
  User as UserIcon,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  X
} from 'lucide-react';
import { MOCK_LISTINGS, MOCK_STUDENT_VERIFICATIONS, MOCK_OWNER_VERIFICATIONS, MOCK_USER, MOCK_VISITS, MOCK_FATEN, MOCK_FARAH, MOCK_HEND } from './constants';
import { Listing, VerificationRequest, Visit, UserProfile } from './types';

const STUDENT_PROFILES: Record<string, UserProfile> = {
  'Lucas Bernard': {
    name: 'Lucas Bernard',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    isStudent: true,
    verified: true,
    rating: 4.9,
    school: 'Sorbonne Université',
    level: '2ème année Licence Informatique',
    status: 'Non-fumeur, calme et ordonné',
    interests: ['Informatique', 'Jeux Vidéo', 'Cinéma'],
  },
  'Sophie Martin': {
    name: 'Sophie Martin',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    isStudent: true,
    verified: true,
    rating: 4.7,
    school: 'Université Paris Cité',
    level: '1ère année Master Biologie',
    status: 'Non-fumeuse, sociable',
    interests: ['Biologie', 'Randonnée', 'Lecture'],
  },
  'Thomas Müller': {
    name: 'Thomas Müller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    isStudent: true,
    verified: true,
    rating: 4.6,
    school: 'Dauphine Paris',
    level: '3ème année Licence Économie',
    status: 'Non-fumeur, calme',
    interests: ['Économie', 'Échecs', 'Football'],
  }
};

const OWNER_PROFILES: Record<string, UserProfile> = {
  'Mme Durand': {
    name: 'Mme Durand',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    isStudent: false,
    verified: true,
    rating: 4.8,
    school: '',
    level: 'Propriétaire Certifié',
    status: 'Réactive et accueillante',
    interests: ['Immobilier', 'Jardinage', 'Cuisine'],
  },
  'Jean Petit': {
    name: 'Jean Petit',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    isStudent: false,
    verified: true,
    rating: 4.6,
    school: '',
    level: 'Propriétaire Certifié',
    status: 'Calme et respectueux',
    interests: ['Rénovation', 'Cinéma', 'Voyage'],
  }
};

// Components
const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 flex-1 py-3 transition-colors ${
      active ? 'text-secondary' : 'text-slate-400'
    }`}
  >
    <Icon size={24} />
    <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
  </button>
);

const Badge = ({ children, variant = 'info' }: { children: ReactNode, variant?: 'success' | 'error' | 'warning' | 'info' | 'gray' }) => {
  const styles = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    warning: 'bg-orange-100 text-orange-700',
    info: 'bg-blue-100 text-blue-700',
    gray: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${styles[variant]}`}>
      {children}
    </span>
  );
};

// Views
const DashboardView = ({ 
  listings, 
  onDeleteListing, 
  onConserveListing 
}: { 
  listings: Listing[], 
  onDeleteListing: (id: string) => void, 
  onConserveListing: (id: string) => void 
}) => (
  <div className="flex flex-col gap-6 py-4">

    <div className="bg-[#eef2ff] p-4 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm font-semibold text-secondary-container">12 Annonces bientôt expirées</p>
      </div>
      <ChevronRight size={20} className="text-secondary" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div className="premium-card p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between text-slate-400">
          <LayoutDashboard size={20} className="text-secondary" />
          <span className="text-xs font-semibold">Total</span>
        </div>
        <p className="text-2xl font-bold">4,281</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase">Annonces</p>
      </div>
      <div className="premium-card p-4 flex flex-col gap-1 border-orange-200">
        <div className="flex items-center justify-between">
          <Clock size={20} className="text-orange-400" />
          <span className="text-xs font-semibold text-orange-400">Action</span>
        </div>
        <p className="text-2xl font-bold">42</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase">En attente</p>
      </div>
      <div className="premium-card p-4 flex flex-col gap-1 border-l-4 border-l-red-500">
        <div className="flex items-center justify-between">
          <AlertTriangle size={20} className="text-red-500" />
          <span className="text-xs font-semibold text-red-500">Critique</span>
        </div>
        <p className="text-2xl font-bold">8</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase">Signalées</p>
      </div>
      <div className="premium-card p-4 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <CalendarDays size={20} className="text-sky-400" />
          <span className="text-xs font-semibold text-slate-400">Trafic</span>
        </div>
        <p className="text-2xl font-bold">12.5k</p>
        <p className="text-[10px] text-slate-400 font-semibold uppercase">Visites</p>
      </div>
    </div>

    <div>
      <h2 className="text-lg font-bold mb-4 uppercase tracking-tight">Activité (30 jours)</h2>
      <div className="premium-card p-5 h-48 flex items-end justify-between gap-1">
         {[40, 60, 50, 70, 45, 90, 75, 60, 55, 65, 50, 95].map((h, i) => (
           <div key={i} className="flex-1 bg-secondary/30 rounded-t-sm" style={{ height: `${h}%` }} />
         ))}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-secondary" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Visites</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-800" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Annonces Validées</span>
        </div>
      </div>
    </div>

    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold uppercase tracking-tight">Modération Prioritaire</h2>
        <button className="text-secondary text-xs font-bold">Voir tout</button>
      </div>
      <div className="flex flex-col gap-4">
        {listings.filter(l => l.status === 'SIGNALÉE' || l.status === 'PÉRIMÉE').length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl border-slate-200">
            Aucun signalement en attente.
          </div>
        ) : (
          listings
            .filter(l => l.status === 'SIGNALÉE' || l.status === 'PÉRIMÉE')
            .map(listing => (
              <div key={listing.id} className="premium-card p-4 flex flex-col gap-4">
                <div className="flex gap-4">
                  <img src={listing.image} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-bold">{listing.title}</h3>
                    <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1">
                      <AlertTriangle size={12} />
                      <span>{listing.status === 'SIGNALÉE' ? 'Annonce suspecte' : 'Images non conformes'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => onConserveListing(listing.id)}
                    className="py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Conserver
                  </button>
                  <button 
                    onClick={() => onDeleteListing(listing.id)}
                    className="py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  </div>
);

const ModerationView = ({
  studentRequests,
  ownerRequests,
  onValidate,
  onReject,
  verifiedCount,
  onSendEmail
}: {
  studentRequests: VerificationRequest[];
  ownerRequests: VerificationRequest[];
  onValidate: (id: string, type: 'students' | 'owners') => void;
  onReject: (id: string, type: 'students' | 'owners') => void;
  verifiedCount: number;
  onSendEmail?: (name: string, text: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'owners'>('students');
  const [emailRequest, setEmailRequest] = useState<VerificationRequest | null>(null);
  const [emailText, setEmailText] = useState('');

  const currentRequests = activeTab === 'students' ? studentRequests : ownerRequests;
  const pendingRequests = currentRequests.filter(r => r.status === 'pending');
  
  const totalPending = studentRequests.filter(r => r.status === 'pending').length + ownerRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="flex flex-col">

      <div className="p-5 flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Vérification des Comptes</h2>
        <p className="text-sm text-slate-500">Examinez les accréditations des {activeTab === 'students' ? 'étudiants' : 'propriétaires'} pour sécuriser la plateforme.</p>
      </div>

      <div className="px-5 mb-6">
        <div className="bg-slate-100 p-1.5 rounded-xl flex">
          <button 
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-white shadow-sm text-secondary' : 'text-slate-500'}`}
          >
            Étudiants
          </button>
          <button 
            onClick={() => setActiveTab('owners')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'owners' ? 'bg-white shadow-sm text-secondary' : 'text-slate-500'}`}
          >
            Propriétaires
          </button>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-6 pb-24">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium bg-slate-50 border border-dashed rounded-xl border-slate-200">
            Aucune demande de vérification en attente pour cette catégorie.
          </div>
        ) : (
          pendingRequests.map(req => (
            <div key={req.id} className="premium-card p-5">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#dae2fd] text-secondary flex items-center justify-center font-bold text-lg">
                    {req.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{req.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      {activeTab === 'students' ? <LayoutDashboard size={14} /> : <MapPin size={14} />}
                      <span>{req.institution}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setEmailRequest(req);
                    setEmailText('');
                  }}
                  className="p-2 border border-secondary text-secondary rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer"
                >
                  <Mail size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <ShieldCheck size={12} /> {activeTab === 'students' ? 'Carte Étudiant' : 'CIN'}
                  </p>
                  <div className="relative rounded-xl overflow-hidden group">
                    <img src={req.idCardImage} className="w-full aspect-[1.6] object-cover" />
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/90 p-3 rounded-full shadow-lg"><SearchIcon size={20} /></button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full"><SearchIcon size={16} /></div>
                  </div>
                </div>

                {req.additionalDoc && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <LayoutDashboard size={12} /> {req.additionalDocLabel}
                    </p>
                    <div className="relative rounded-xl overflow-hidden group">
                      <img src={req.additionalDoc} className="w-full aspect-[1.6] object-cover" />
                      <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full"><SearchIcon size={16} /></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button 
                  onClick={() => onValidate(req.id, activeTab)}
                  className="w-full py-4 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={20} />
                  {activeTab === 'students' ? 'Valider Profil' : 'Certifier Logement'}
                </button>
                <button 
                  onClick={() => onReject(req.id, activeTab)}
                  className="w-full py-4 border border-red-500 hover:bg-red-50 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Trash2 size={20} className="rotate-45" />
                  {activeTab === 'students' ? 'Rejeter' : 'Non-Conformes'}
                </button>
              </div>
            </div>
          ))
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="premium-card p-5 bg-slate-50/50">
            <p className="text-[10px] font-bold text-secondary uppercase mb-1">En attente</p>
            <p className="text-3xl font-display font-bold">{totalPending}</p>
          </div>
          <div className="premium-card p-5 bg-slate-50/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vérifiés (24h)</p>
            <p className="text-3xl font-display font-bold">{verifiedCount}</p>
          </div>
        </div>

        <div className="premium-card p-5 mt-4 flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Temps de réponse</span>
          <span className="text-3xl font-display font-bold text-secondary">2.4h</span>
        </div>
      </div>

      <AnimatePresence>
        {emailRequest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailRequest(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 flex flex-col gap-4 z-10 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Contacter {emailRequest.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailRequest(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Subtitle/Listing context */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#dae2fd] text-secondary flex items-center justify-center font-bold text-sm">
                  {emailRequest.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-700 truncate">{emailRequest.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{emailRequest.institution}</p>
                </div>
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Votre message</label>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Écrivez le texte de votre e-mail ici..."
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-slate-400 resize-none"
                  autoFocus
                />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEmailRequest(null)}
                  className="py-3 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all cursor-pointer text-center mr-0"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!emailText.trim()) return;
                    onSendEmail?.(emailRequest.name, emailText);
                    setEmailRequest(null);
                  }}
                  disabled={!emailText.trim()}
                  className="py-3 text-xs font-bold bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <Mail size={14} /> Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ListingsView = ({ 
  listings, 
  onListingClick, 
  onDeleteListing,
  onAlertOwner,
  onSendEmail
}: { 
  listings: Listing[], 
  onListingClick: (l: Listing) => void, 
  onDeleteListing: (id: string) => void,
  onAlertOwner: (id: string) => void,
  onSendEmail: (id: string, text: string) => void
}) => {
  const [activeTab, setActiveTab] = useState<'PROPRIÉTAIRE' | 'ÉTUDIANT'>('PROPRIÉTAIRE');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'unverified' | 'date'>('all');
  const [emailListing, setEmailListing] = useState<Listing | null>(null);
  const [emailText, setEmailText] = useState('');

  const filteredListings = listings.filter(listing => {
    // 1. Filter by owner vs student
    const matchesTab = (listing.postedBy || 'PROPRIÉTAIRE') === activeTab;
    
    // 2. Filter by search text query
    const matchesSearch = searchQuery === '' || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Filter by minor categories
    if (filterType === 'verified') {
      return matchesTab && matchesSearch && listing.verified;
    }
    if (filterType === 'unverified') {
      return matchesTab && matchesSearch && !listing.verified;
    }
    
    return matchesTab && matchesSearch;
  });

  const displayListings = filterType === 'date' 
    ? [...filteredListings].sort((a, b) => parseInt(b.id) - parseInt(a.id))
    : filteredListings;

  return (
    <div className="flex flex-col">

      <div className="p-5 flex gap-1.5 p-1.5 bg-slate-100 rounded-xl m-5">
        <button 
          onClick={() => setActiveTab('PROPRIÉTAIRE')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'PROPRIÉTAIRE' 
              ? 'bg-white shadow-sm text-secondary' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Propriétaire
        </button>
        <button 
          onClick={() => setActiveTab('ÉTUDIANT')}
          className={`flex-1 py-2 rounded-lg font-bold transition-all cursor-pointer ${
            activeTab === 'ÉTUDIANT' 
              ? 'bg-white shadow-sm text-secondary' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          étudiant
        </button>
      </div>

      <div className="px-5 mb-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une annonce, un email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 premium-card outline-none focus:border-secondary transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 mb-8 scrollbar-hide">
        <button 
          onClick={() => setFilterType(filterType === 'date' ? 'all' : 'date')}
          className={`px-5 py-2 border font-bold rounded-full whitespace-nowrap text-xs transition-colors cursor-pointer ${
            filterType === 'date' 
              ? 'border-2 border-secondary text-secondary bg-blue-50/50' 
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          Date
        </button>
        <button 
          onClick={() => setFilterType(filterType === 'verified' ? 'all' : 'verified')}
          className={`px-5 py-2 border font-bold rounded-full whitespace-nowrap text-xs transition-colors cursor-pointer ${
            filterType === 'verified' 
              ? 'border-2 border-secondary text-secondary bg-blue-50/50' 
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          Vérifié
        </button>
        <button 
          onClick={() => setFilterType(filterType === 'unverified' ? 'all' : 'unverified')}
          className={`px-5 py-2 border font-bold rounded-full whitespace-nowrap text-xs transition-colors cursor-pointer ${
            filterType === 'unverified' 
              ? 'border-2 border-secondary text-secondary bg-blue-50/50' 
              : 'border-slate-200 text-slate-500 hover:border-slate-300'
          }`}
        >
          Non vérifié
        </button>
        <button 
          onClick={() => { setFilterType('all'); setSearchQuery(''); }}
          className="px-5 py-2 border border-slate-200 text-slate-500 font-bold rounded-full whitespace-nowrap text-xs hover:border-slate-300 cursor-pointer"
        >
          Tout
        </button>
      </div>

      <div className="px-5 flex flex-col gap-6">
        {displayListings.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            Aucune annonce trouvée pour cette sélection.
          </div>
        ) : (
          displayListings.map(listing => (
            <div key={listing.id} onClick={() => onListingClick(listing)} className="premium-card overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer">
              <div className="relative">
                <img src={listing.image} className="w-full aspect-[16/10] object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded text-white text-xs font-bold">
                  {listing.price} TND
                </div>
                {listing.verified && (
                  <div className="absolute top-3 right-3 glass p-2 rounded-full">
                    <CheckCircle2 size={16} className="text-secondary" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg">{listing.title}</h3>
                  <Badge variant={listing.status === 'ACTIVE' ? 'success' : listing.status === 'SIGNALÉE' ? 'warning' : 'gray'}>
                    {listing.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs mb-6">
                  <span className="truncate">{listing.location}</span>
                  {listing.verified && <CheckCircle2 size={14} className="text-secondary flex-shrink-0" />}
                </div>
                <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmailListing(listing);
                      setEmailText('');
                    }}
                    className="flex-1 bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer"
                  >
                    <Mail size={16} /> Email
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAlertOwner(listing.id);
                    }}
                    className="flex-1 bg-[#dae2fd] hover:bg-[#cdd8fc] active:bg-[#bfcffd] text-secondary py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all cursor-pointer"
                  >
                    <AlertTriangle size={16} /> Alerte
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteListing(listing.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors cursor-pointer"
                    title="Supprimer l'annonce"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {emailListing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailListing(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 flex flex-col gap-4 z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Contacter le propriétaire</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailListing(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Subtitle/Listing context */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-3 items-center">
                <img src={emailListing.image} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-700 truncate">{emailListing.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{emailListing.location}</p>
                </div>
              </div>

              {/* Textarea Label and Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Votre message</label>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Écrivez le texte de votre email ici..."
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-slate-400 resize-none"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEmailListing(null)}
                  className="py-3 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!emailText.trim()) return;
                    onSendEmail(emailListing.id, emailText);
                    setEmailListing(null);
                  }}
                  disabled={!emailText.trim()}
                  className="py-3 text-xs font-bold bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <Mail size={14} /> Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileView = ({ user = MOCK_USER, onBack }: { user?: UserProfile, onBack: () => void }) => (
  <div className="flex flex-col pb-24 bg-white min-h-screen">
    <header className="px-5 py-6 flex items-center border-b">
      <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer mr-2">
        <ChevronLeft size={24} className="text-slate-800" />
      </button>
      <div className="flex-1 flex justify-center items-center gap-2">
        <LayoutDashboard size={20} className="text-secondary" />
        <span className="font-bold text-xl lowercase">bity</span>
      </div>
      <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
    </header>

    <div className="flex flex-col items-center mt-10 px-5">
      <div className="relative">
        <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" />
        {user.verified && (
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border shadow-sm">
            <CheckCircle2 size={14} className="text-secondary" />
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
      <Badge variant="info">{user.isStudent ? "Verified Student" : "Verified Owner"}</Badge>

      <div className="premium-card w-full mt-12 p-6 flex flex-col gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Community Trust</span>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-display font-bold">{user.rating}</span>
          <span className="text-slate-400 font-bold">/ 5</span>
          <div className="flex gap-1 ml-4">
            {Array.from({ length: Math.floor(user.rating) }).map((_, i) => (
              <Star key={i} size={18} fill="#0051d5" className="text-secondary" />
            ))}
            {user.rating % 1 !== 0 && (
              <Star key="half" size={18} fill="#0051d5" className="text-secondary opacity-60" />
            )}
            {Array.from({ length: 5 - Math.ceil(user.rating) }).map((_, i) => (
              <Star key={`empty-${i}`} size={18} className="text-slate-300" />
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="p-8 pb-4">
      <h2 className="text-2xl font-bold mb-6">Informations Personnelles</h2>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Établissement</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">{user.school}</div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Niveau</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">{user.level}</div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Statut</p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">{user.status}</div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Centres d'intérêt</p>
          <div className="flex flex-wrap gap-2.5">
            {user.interests.map(interest => (
              <span key={interest} className="px-4 py-2.5 bg-[#dae2fd] text-secondary rounded-full text-sm font-bold">{interest}</span>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Recent Activity</h2>
        <button className="text-secondary text-sm font-bold">View All</button>
      </div>
      <div className="flex flex-col gap-4">
        {[
          { title: 'Tunis Centre', date: '2 days ago', img: MOCK_LISTINGS[1].image },
          { title: 'La Marsa', date: '1 week ago', img: MOCK_LISTINGS[2].image }
        ].map((act, i) => (
          <div key={i} className="premium-card p-3 flex gap-4 items-center">
            <img src={act.img} className="w-14 h-14 rounded-lg object-cover" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Recent Search</p>
              <p className="font-bold">{act.title}</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1">
                <Clock size={10} /> {act.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DetailsView = ({ listing, onBack, onRoommateClick }: { listing: Listing, onBack: () => void, onRoommateClick: (name: string) => void }) => (
  <div className="flex flex-col bg-white min-h-screen pb-12">
     <div className="relative">
       <div className="absolute top-4 left-4 z-10">
         <button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"><ChevronLeft size={20} /></button>
       </div>
       <div className="absolute top-4 right-4 z-10 flex gap-2">
         <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"><CalendarDays size={20} /></button>
         <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-secondary"><Star size={20} /></button>
       </div>
       <img src={listing.image} className="w-full aspect-[4/3] object-cover" />
       <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-1.5 rounded-full flex items-center gap-2">
         <CheckCircle2 size={14} className="text-secondary" />
         <span className="text-xs font-bold text-secondary">Annonce Vérifiée</span>
       </div>
       <div className="absolute bottom-4 right-4 bg-black/40 px-3 py-1 rounded text-white text-[10px] font-bold">1 / 8</div>
     </div>

     <div className="p-6">
       <h1 className="text-3xl font-bold leading-tight">Chambre Lumineuse en Colocation - Tunis</h1>
       <div className="flex items-center gap-1 text-slate-500 text-sm mt-2 mb-6">
         <MapPin size={16} />
         <span>Ariana, Tunis - Proche Campus El Manar</span>
       </div>

       <div className="flex items-end gap-2 mb-8">
         <span className="text-5xl font-display font-bold text-secondary">{listing.price} TND</span>
         <span className="text-slate-400 font-medium mb-1">/ mois</span>
       </div>

       <div className="flex gap-2 mb-10">
         <span className="px-4 py-2 bg-[#dae2fd] text-secondary rounded-full text-xs font-bold">Charges comprises</span>
         <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">Éligible APL</span>
       </div>

       <div className="grid grid-cols-2 gap-4">
         {[
           { icon: LayoutDashboard, label: 'SURFACE', value: '14 m²' },
           { icon: ShieldCheck, label: 'MEUBLÉ', value: 'Oui' },
           { icon: CalendarDays, label: 'ÉTAGE', value: '2ème' },
           { icon: UserIcon, label: 'DISPO', value: 'Immédiate' }
         ].map((item, i) => (
           <div key={i} className="premium-card p-4 flex flex-col items-center justify-center text-center gap-2">
             <item.icon size={20} className="text-slate-800" />
             <div>
               <p className="text-[10px] font-bold text-slate-400 tracking-widest">{item.label}</p>
               <p className="font-bold">{item.value}</p>
             </div>
           </div>
         ))}
       </div>

       <div className="premium-card mt-8 p-6">
         <h2 className="text-lg font-bold mb-4">À propos de la chambre</h2>
         <p className="text-slate-600 text-sm leading-relaxed mb-4">
           Superbe chambre de 14m² dans un appartement de 100m² entièrement rénové. La chambre est équipée d'un lit double (140x200), d'un grand dressing, d'un bureau avec chaise ergonomique. Orientée plein sud, elle offre une très belle luminosité tout au long de la journée.
         </p>
         <button className="text-secondary text-sm font-bold flex items-center gap-1">Lire la suite <ChevronRight size={14} className="rotate-90" /></button>
       </div>

       <div className="premium-card mt-6 p-6">
         <h2 className="text-lg font-bold mb-6">La Colocation</h2>
         <div className="flex gap-4 mb-6">
            <div className="flex -space-x-2">
              <div 
                onClick={() => onRoommateClick('Faten')} 
                className="w-10 h-10 rounded-full border-2 border-white bg-[#fda4af] text-rose-950 flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm"
                title="Voir le profil de Faten"
              >
                F
              </div>
               <div 
                 onClick={() => onRoommateClick('Farah')} 
                 className="w-10 h-10 rounded-full border-2 border-white bg-[#fde047] text-yellow-950 flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm"
                 title="Voir le profil de Farah"
               >
                 F
               </div>
               <div 
                 onClick={() => onRoommateClick('Hend')} 
                 className="w-10 h-10 rounded-full border-2 border-white bg-[#bae6fd] text-sky-950 flex items-center justify-center font-bold text-xs cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm"
                 title="Voir le profil de Hend"
               >
                 H
               </div>
            </div>
            <div>
              <p className="font-bold text-sm">3 colocataires actuels</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                <span onClick={() => onRoommateClick('Faten')} className="text-secondary hover:underline cursor-pointer font-bold">Faten</span>, <span onClick={() => onRoommateClick('Farah')} className="text-secondary hover:underline cursor-pointer font-bold">Farah</span>, <span onClick={() => onRoommateClick('Hend')} className="text-secondary hover:underline cursor-pointer font-bold">Hend</span>...
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Étudiants</p>
            </div>
         </div>
         <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl leading-relaxed">
           Ambiance calme et studieuse. Nous recherchons une personne respectueuse, propre et conviviale pour partager des repas de temps en temps.
         </p>
       </div>
     </div>
  </div>
);

const VisitsView = ({
  visits,
  onValidateVisit,
  onSendEmail,
  onStudentClick,
  onOwnerClick,
  onRelancer
}: {
  visits: Visit[];
  onValidateVisit: (id: string) => void;
  onSendEmail: (ownerName: string, propertyTitle: string, text: string) => void;
  onStudentClick?: (name: string) => void;
  onOwnerClick?: (name: string) => void;
  onRelancer?: (visit: Visit) => void;
}) => {
  const [emailVisit, setEmailVisit] = useState<Visit | null>(null);
  const [emailText, setEmailText] = useState('');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [remindedIds, setRemindedIds] = useState<string[]>([]);

  return (
    <div className="flex flex-col">

      <div className="flex gap-3 p-5">
        <button className="flex-1 py-3 bg-secondary text-white rounded-xl font-bold text-sm shadow-lg shadow-secondary/20">Aujourd'hui</button>
        <button className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-sm">Litiges</button>
        <button className="flex-1 py-3 border border-slate-200 text-slate-500 rounded-xl font-bold text-sm">À venir</button>
      </div>

      <div className="px-5 flex flex-col gap-6 pb-24">
        {visits.map(visit => (
          <div key={visit.id} className="premium-card p-5">
            <div className="flex items-center gap-3 mb-6">
              <Badge variant={visit.status === 'Confirmed' ? 'success' : visit.status === 'Pending' ? 'warning' : 'gray'}>
                {visit.status === 'Confirmed' ? 'Confirmé' : visit.status === 'Pending' ? 'En attente' : 'Terminé'}
              </Badge>
              <span className="text-sm font-bold text-slate-800">{visit.time}</span>
              <div className="flex-1" />
              <Settings size={18} className="text-slate-300" />
            </div>

            {visit.status !== 'Completed' && (
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Étudiant</p>
                  <p 
                    onClick={() => onStudentClick?.(visit.studentName)}
                    className="font-bold text-lg hover:text-secondary hover:underline cursor-pointer transition-all duration-200"
                  >
                    {visit.studentName}
                  </p>
                  <div className="flex items-center gap-1 text-secondary text-[10px] font-bold mt-1 px-2 py-0.5 bg-[#dae2fd] rounded-full w-fit">
                    <ShieldCheck size={12} /> Carte Étudiant Vérifiée
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Propriétaire</p>
                  <p 
                    onClick={() => onOwnerClick?.(visit.ownerName)}
                    className="font-bold text-lg hover:text-secondary hover:underline cursor-pointer transition-all duration-200"
                  >
                    {visit.ownerName}
                  </p>
                  <div className="flex items-center gap-1 text-sky-500 text-[10px] font-bold mt-1 px-2 py-0.5 bg-sky-50 rounded-full w-fit border border-sky-100">
                    <CalendarDays size={12} /> Logement Certifié
                  </div>
                </div>
              </div>
            )}

            {visit.propertyImage && (
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-4 mb-8">
                <img src={visit.propertyImage} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <p className="font-bold">{visit.propertyTitle}</p>
                  <div className="flex items-center gap-1 text-secondary text-[10px] font-bold mt-1">
                    <MapPin size={10} /> {visit.propertyLocation}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {visit.status === 'Confirmed' ? (
                <>
                  <button 
                    onClick={() => {
                      setEmailVisit(visit);
                      setEmailText('');
                    }}
                    className="flex-1 bg-secondary text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold cursor-pointer hover:bg-secondary/90 transition-colors"
                  >
                    <Mail size={18} /> Email / Contact
                  </button>
                  <button className="aspect-square bg-white border border-red-200 text-red-500 rounded-xl flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </button>
                </>
              ) : visit.status === 'Pending' ? (
                <>
                  <button 
                    onClick={() => setSelectedVisit(visit)}
                    className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Détails
                  </button>
                  {remindedIds.includes(visit.id) ? (
                    <button 
                      disabled
                      className="flex-1 bg-emerald-50 border border-emerald-200 py-3 rounded-xl font-bold text-emerald-600 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 size={16} /> Relancé
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setRemindedIds(prev => [...prev, visit.id]);
                        onRelancer?.(visit);
                      }}
                      className="flex-1 border border-slate-200 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      Relancer
                    </button>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">Visite effectuée avec succès</p>
                  <div className="flex -space-x-2">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                      onClick={() => onOwnerClick?.(visit.ownerName !== 'Visite effectuée avec succès' ? visit.ownerName : 'Mme Durand')}
                      title={`Propriétaire: ${visit.ownerName !== 'Visite effectuée avec succès' ? visit.ownerName : 'Mme Durand'}`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-110 hover:z-10 transition-transform duration-250" 
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                      onClick={() => onStudentClick?.(visit.studentName)}
                      title={`Étudiant: ${visit.studentName}`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-110 hover:z-10 transition-transform duration-250" 
                    />
                  </div>
                </div>
              )}
            </div>

            {visit.status === 'Confirmed' && (
              <button 
                onClick={() => onValidateVisit(visit.id)}
                className="w-full mt-3 py-4 bg-slate-100 text-slate-900 hover:bg-slate-200 active:scale-[0.99] rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <CheckCircle2 size={18} /> Valider la visite terminée
              </button>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {emailVisit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEmailVisit(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 flex flex-col gap-4 z-10 text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Mail size={16} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Contacter le propriétaire</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailVisit(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Subtitle/Listing context */}
              {emailVisit.propertyImage && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-3 items-center">
                  <img src={emailVisit.propertyImage} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-700 truncate">{emailVisit.propertyTitle}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">M. / Mme {emailVisit.ownerName}</p>
                  </div>
                </div>
              )}

              {/* Textarea Label and Area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Votre message</label>
                <textarea
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Écrivez le texte de votre email ici..."
                  className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/50 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all placeholder:text-slate-400 resize-none"
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setEmailVisit(null)}
                  className="py-3 text-xs font-bold text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-xl transition-all cursor-pointer text-center"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!emailText.trim()) return;
                    onSendEmail(emailVisit.ownerName, emailVisit.propertyTitle, emailText);
                    setEmailVisit(null);
                  }}
                  disabled={!emailText.trim()}
                  className="py-3 text-xs font-bold bg-secondary hover:bg-secondary/90 active:scale-[0.98] text-white rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <Mail size={14} /> Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedVisit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVisit(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-100 flex flex-col gap-4 z-10 text-left animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Détails de la demande de visite</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVisit(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-[10px]">Statut :</span>
                <Badge variant={selectedVisit.status === 'Confirmed' ? 'success' : selectedVisit.status === 'Pending' ? 'warning' : 'gray'}>
                  {selectedVisit.status === 'Confirmed' ? 'Confirmé' : selectedVisit.status === 'Pending' ? 'En attente' : 'Terminé'}
                </Badge>
              </div>

              {/* Property Details Card */}
              {selectedVisit.propertyImage && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-3 items-center">
                  <img src={selectedVisit.propertyImage} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-700 truncate">{selectedVisit.propertyTitle}</h4>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold mt-1">
                      <MapPin size={10} /> {selectedVisit.propertyLocation}
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Section */}
              <div className="bg-slate-50/50 border border-slate-100/80 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <CalendarDays size={14} className="text-secondary" />
                  <span className="font-semibold text-slate-500">Date :</span>
                  <span className="font-bold text-slate-800">{selectedVisit.date || "28 Mai 2026"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock size={14} className="text-secondary" />
                  <span className="font-semibold text-slate-500">Heure de visite :</span>
                  <span className="font-bold text-slate-800">{selectedVisit.time}</span>
                </div>
              </div>

              {/* People involved */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-t pt-3 border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Étudiant</span>
                    <button 
                      onClick={() => {
                        onStudentClick?.(selectedVisit.studentName);
                        setSelectedVisit(null);
                      }}
                      className="font-bold text-slate-800 hover:text-secondary hover:underline cursor-pointer text-left transition-colors text-sm"
                    >
                      {selectedVisit.studentName}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-[#059669] text-[10px] font-bold px-2 py-0.5 bg-[#ecfdf5] rounded-full border border-[#d1fae5]">
                    <ShieldCheck size={11} /> Dossier Validé
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3 border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Propriétaire</span>
                    <button 
                      onClick={() => {
                        onOwnerClick?.(selectedVisit.ownerName);
                        setSelectedVisit(null);
                      }}
                      className="font-bold text-slate-800 hover:text-secondary hover:underline cursor-pointer text-left transition-colors text-sm"
                    >
                      {selectedVisit.ownerName}
                    </button>
                  </div>
                  <div className="flex items-center gap-1 text-sky-500 text-[10px] font-bold px-2 py-0.5 bg-sky-50 rounded-full border border-sky-100">
                    <CalendarDays size={11} /> Compte Certifié
                  </div>
                </div>
              </div>

              {/* Description helper text */}
              <p className="text-[11px] text-slate-400 italic text-center bg-slate-50 p-2.5 rounded-lg border border-slate-100/60 leading-normal mt-1">
                "Cette demande de visite est en cours de traitement. Une fois acceptée par les deux résidents, vous recevrez toutes les étapes pour l&#39;emménagement."
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setSelectedVisit(null)}
                  className="flex-1 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100 rounded-xl border border-slate-200 transition-all cursor-pointer text-center outline-none"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmailVisit(selectedVisit);
                    setEmailText('');
                    setSelectedVisit(null);
                  }}
                  className="flex-1 py-3 text-xs font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl shadow-lg shadow-secondary/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <Mail size={14} /> Envoyer un mail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'moderation' | 'listings' | 'stats'>('dashboard');
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'details'>('main');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
  const [previousView, setPreviousView] = useState<'main' | 'details'>('main');
  
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [studentRequests, setStudentRequests] = useState<VerificationRequest[]>(MOCK_STUDENT_VERIFICATIONS);
  const [ownerRequests, setOwnerRequests] = useState<VerificationRequest[]>(MOCK_OWNER_VERIFICATIONS);
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);
  const [verifiedCount, setVerifiedCount] = useState<number>(32);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const handleValidateVisit = (id: string) => {
    const visit = visits.find(v => v.id === id);
    if (visit) {
      setVisits(prev => prev.map(v => v.id === id ? { ...v, status: 'Completed' } : v));
      setToast({
        message: `La visite de "${visit.studentName}" chez "${visit.ownerName}" a été enregistrée comme terminée.`,
        type: 'success'
      });
      setTimeout(() => {
        setToast(prev => prev?.message.includes(visit.studentName) ? null : prev);
      }, 4000);
    }
  };

  const handleValidateVerification = (id: string, type: 'students' | 'owners') => {
    if (type === 'students') {
      const request = studentRequests.find(r => r.id === id);
      if (request) {
        setStudentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
        setVerifiedCount(prev => prev + 1);
        setToast({
          message: `Le profil étudiant de "${request.name}" a été validé avec succès.`,
          type: 'info'
        });
        setTimeout(() => {
          setToast(prev => prev?.message === `Le profil étudiant de "${request.name}" a été validé avec succès.` ? null : prev);
        }, 4000);
      }
    } else {
      const request = ownerRequests.find(r => r.id === id);
      if (request) {
        setOwnerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
        setVerifiedCount(prev => prev + 1);
        setToast({
          message: `Le logement/profil de "${request.name}" a été certifié avec succès.`,
          type: 'info'
        });
        setTimeout(() => {
          setToast(prev => prev?.message === `Le logement/profil de "${request.name}" a été certifié avec succès.` ? null : prev);
        }, 4000);
      }
    }
  };

  const handleRejectVerification = (id: string, type: 'students' | 'owners') => {
    if (type === 'students') {
      const request = studentRequests.find(r => r.id === id);
      if (request) {
        setStudentRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
        setToast({
          message: `La demande de "${request.name}" a été rejetée.`,
          type: 'success'
        });
        setTimeout(() => {
          setToast(prev => prev?.message === `La demande de "${request.name}" a été rejetée.` ? null : prev);
        }, 4000);
      }
    } else {
      const request = ownerRequests.find(r => r.id === id);
      if (request) {
        setOwnerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
        setToast({
          message: `La demande de "${request.name}" a été rejetée.`,
          type: 'success'
        });
        setTimeout(() => {
          setToast(prev => prev?.message === `La demande de "${request.name}" a été rejetée.` ? null : prev);
        }, 4000);
      }
    }
  };

  const handleDeleteListing = (id: string) => {
    const listingToDelete = listings.find(l => l.id === id);
    setListings(prev => prev.filter(l => l.id !== id));
    if (listingToDelete) {
      setToast({
        message: `L'annonce "${listingToDelete.title}" a été supprimée de la plateforme.`,
        type: 'success'
      });
      setTimeout(() => {
        setToast(prev => prev?.message === `L'annonce "${listingToDelete.title}" a été supprimée de la plateforme.` ? null : prev);
      }, 4000);
    }
  };

  const handleConserveListing = (id: string) => {
    const listingToUpdate = listings.find(l => l.id === id);
    if (listingToUpdate) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'ACTIVE' } : l));
      setToast({
        message: `L'annonce "${listingToUpdate.title}" a été confirmée et conservée.`,
        type: 'info'
      });
      setTimeout(() => {
        setToast(prev => prev?.message === `L'annonce "${listingToUpdate.title}" a été confirmée et conservée.` ? null : prev);
      }, 4000);
    }
  };

  const handleAlertOwner = (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      setToast({
        message: `Une alerte de signalement a été envoyée au propriétaire de l'annonce "${listing.title}".`,
        type: 'info'
      });
      setTimeout(() => {
        setToast(prev => prev?.message === `Une alerte de signalement a été envoyée au propriétaire de l'annonce "${listing.title}".` ? null : prev);
      }, 4000);
    }
  };

  const handleSendEmail = (id: string, text: string) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      setToast({
        message: `Votre email a été envoyé avec succès au propriétaire de l'annonce "${listing.title}".`,
        type: 'info'
      });
      setTimeout(() => {
        setToast(prev => prev?.message === `Votre email a été envoyé avec succès au propriétaire de l'annonce "${listing.title}".` ? null : prev);
      }, 4000);
    }
  };

  const handleBackFromProfile = () => {
    if (viewedProfile && (viewedProfile.name === 'Faten Aloui' || viewedProfile.name === 'Farah Ben Amor' || viewedProfile.name === 'Hend Chaabane')) {
      setViewedProfile(null);
      setCurrentView(previousView || 'main');
    } else {
      setViewedProfile(null);
      setCurrentView('main');
    }
  };

  const renderContent = () => {
    if (currentView === 'profile') {
      return <ProfileView user={viewedProfile || MOCK_USER} onBack={handleBackFromProfile} />;
    }
    if (currentView === 'details' && selectedListing) {
      return (
        <DetailsView 
          listing={selectedListing} 
          onBack={() => setCurrentView('main')} 
          onRoommateClick={(name) => {
            if (name === 'Faten') {
              setViewedProfile(MOCK_FATEN);
              setPreviousView('details');
              setCurrentView('profile');
            } else if (name === 'Farah') {
              setViewedProfile(MOCK_FARAH);
              setPreviousView('details');
              setCurrentView('profile');
            } else if (name === 'Hend') {
              setViewedProfile(MOCK_HEND);
              setPreviousView('details');
              setCurrentView('profile');
            }
          }}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard': return (
        <DashboardView 
          listings={listings} 
          onDeleteListing={handleDeleteListing} 
          onConserveListing={handleConserveListing} 
        />
      );
      case 'moderation': return (
        <ModerationView 
          studentRequests={studentRequests}
          ownerRequests={ownerRequests}
          onValidate={handleValidateVerification}
          onReject={handleRejectVerification}
          verifiedCount={verifiedCount}
          onSendEmail={(name, text) => {
            setToast({
              message: `Votre email a été envoyé avec succès à "${name}".`,
              type: 'info'
            });
            setTimeout(() => {
              setToast(prev => prev?.message.includes(name) ? null : prev);
            }, 4000);
          }}
        />
      );
      case 'listings': return (
        <ListingsView 
          listings={listings} 
          onListingClick={(l) => { setSelectedListing(l); setCurrentView('details'); }} 
          onDeleteListing={handleDeleteListing}
          onAlertOwner={handleAlertOwner}
          onSendEmail={handleSendEmail}
        />
      );
      case 'stats': return (
        <VisitsView 
          visits={visits}
          onValidateVisit={handleValidateVisit}
          onSendEmail={(ownerName, propertyTitle) => {
            setToast({
              message: `Votre email a été envoyé avec succès au propriétaire de l'annonce "${propertyTitle}".`,
              type: 'info'
            });
            setTimeout(() => {
              setToast(prev => prev?.message.includes(propertyTitle) ? null : prev);
            }, 4000);
          }}
          onStudentClick={(studentName) => {
            const profile = STUDENT_PROFILES[studentName] || {
              name: studentName,
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              isStudent: true,
              verified: true,
              rating: 4.8,
              school: 'Faculté de Tunis',
              level: 'Étudiant',
              status: 'Calme et respectueux',
              interests: ['Études', 'Cuisine'],
            };
            setViewedProfile(profile);
            setPreviousView('main');
            setCurrentView('profile');
          }}
          onOwnerClick={(ownerName) => {
            const profile = OWNER_PROFILES[ownerName] || {
              name: ownerName,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              isStudent: false,
              verified: true,
              rating: 4.7,
              school: '',
              level: 'Propriétaire Certifié',
              status: 'Réactive et accueillante',
              interests: ['Immobilier', 'Droit', 'Voyage'],
            };
            setViewedProfile(profile);
            setPreviousView('main');
            setCurrentView('profile');
          }}
          onRelancer={(visit) => {
            setToast({
              message: `Une relance de visite a été envoyée à ${visit.studentName} et ${visit.ownerName} !`,
              type: 'success'
            });
            setTimeout(() => {
              setToast(prev => prev?.message.includes(visit.studentName) ? null : prev);
            }, 4500);
          }}
        />
      );
      default: return (
        <DashboardView 
          listings={listings} 
          onDeleteListing={handleDeleteListing} 
          onConserveListing={handleConserveListing} 
        />
      );
    }
  };

  const Header = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'moderation', label: 'Modérer' },
      { id: 'listings', label: 'Annonces' },
      { id: 'stats', label: 'Visites' },
    ];

    return (
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-16 max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center justify-between h-full w-full">
          {/* Left Side: Logo */}
          <div 
            onClick={() => { setViewedProfile(null); setCurrentTab('dashboard'); setCurrentView('main'); }} 
            className="flex items-center gap-2 shrink-0 cursor-pointer hover:opacity-95 active:scale-98 transition-all"
          >
            <ShieldCheck className="text-secondary" strokeWidth={2.5} size={24} />
            <span className="font-display text-2xl font-bold text-secondary tracking-tighter">bity</span>
            <span className="text-[10px] bg-secondary/10 text-secondary px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ml-1">Admin</span>
          </div>

          {/* Center Side: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-neutral-100/60 p-1 rounded-full relative">
            {navItems.map(({ id, label }) => {
              const active = currentTab === id && currentView === 'main';
              return (
                <button
                  key={id}
                  onClick={() => { setViewedProfile(null); setCurrentTab(id); setCurrentView('main'); }}
                  className={`relative px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                    active
                      ? 'text-white font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="desktopActiveTab"
                      className="absolute inset-0 bg-secondary rounded-full -z-10 shadow-sm shadow-secondary/15"
                      transition={{ type: 'spring', duration: 0.38, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Quick Action & Profile indicator */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => { setViewedProfile(null); setCurrentTab('moderation'); setCurrentView('main'); }} 
              className="text-slate-500 hover:text-secondary transition-colors p-2 rounded-full hover:bg-neutral-50 relative cursor-pointer"
            >
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button 
              onClick={() => { setViewedProfile(MOCK_USER); setCurrentView('profile'); }}
              className="text-slate-500 hover:text-secondary transition-colors p-2 rounded-full hover:bg-neutral-50 cursor-pointer"
            >
              <UserIcon size={22} />
            </button>
          </div>
        </div>
      </header>
    );
  };

  const BottomNav = () => {
    const navItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'moderation', icon: ShieldCheck, label: 'Modérer' },
      { id: 'listings', icon: Search, label: 'Annonces' },
      { id: 'stats', icon: CalendarDays, label: 'Visites' },
    ];

    return (
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-4 pb-safe bg-white border-t border-slate-100 md:hidden rounded-t-2xl shadow-lg">
        {navItems.map(({ id, icon: Icon, label }) => {
          const active = currentTab === id && currentView === 'main';
          return (
            <button 
              key={id}
              onClick={() => { setViewedProfile(null); setCurrentTab(id); setCurrentView('main'); }} 
              className={`flex flex-col items-center justify-center flex-1 transition-all cursor-pointer ${active ? 'text-secondary font-bold' : 'text-slate-500'}`}
            >
              {active ? (
                <div className="bg-secondary/10 rounded-full px-6 py-2 mb-1">
                   <Icon size={24} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />
                </div>
              ) : (
                 <Icon size={24} strokeWidth={2} className="mb-1" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-surface font-sans">
      <Header />
      <main className="pt-24 pb-32 md:pb-12 max-w-2xl mx-auto w-full px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView === 'main' ? currentTab : (viewedProfile ? `profile-${viewedProfile.name}` : currentView)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 flex w-[calc(100%-2rem)] max-w-sm border p-4 rounded-xl shadow-2xl z-[100] gap-3 bg-white/95 backdrop-blur-xl -translate-x-1/2 ${
              toast.type === 'success' 
                ? 'border-red-100 text-slate-800' 
                : 'border-blue-100 text-slate-800'
            }`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              toast.type === 'success' 
                ? 'bg-red-50 text-red-500' 
                : 'bg-blue-50 text-blue-500'
            }`}>
              {toast.type === 'success' ? <Trash2 size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 bg-slate-50 hover:bg-slate-100 rounded-md cursor-pointer transition-colors self-start"
            >
              Fermer
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}

