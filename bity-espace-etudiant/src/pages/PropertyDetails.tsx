import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Heart, MapPin, 
  Maximize, Armchair, Layers, Users, User, Home,
  MessageCircle, FileText, CheckCircle2,
  ChevronDown, Wifi, WashingMachine, Refrigerator, Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { Property } from '@/src/types';
import { authFetch, requireAuth, mapBackendAdToProperty } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';
import AreaMapSection from '@/src/components/AreaMapSection';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    requireAuth();

    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const res = await authFetch(`/ads/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ad) {
            setProperty(mapBackendAdToProperty(data.ad));
          }
        }
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-bold uppercase tracking-wider text-sm animate-pulse">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (!property) return <div className="p-10 text-center font-bold text-lg text-error">Propriété non trouvée</div>;

  return (
    <div className="max-w-7xl mx-auto w-full pb-32">
      {/* Property Header (Mobile) */}
      <div className="md:hidden sticky top-0 z-40 glass-panel h-16 px-6 flex items-center justify-between border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container">
          <ArrowLeft className="w-6 h-6 text-secondary" />
        </button>
        <span className="font-display font-bold text-secondary">bity</span>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-surface-container text-secondary"><Share2 className="w-6 h-6" /></button>
          <button className="p-2 rounded-full hover:bg-surface-container text-secondary"><Heart className="w-6 h-6" /></button>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <section className="relative w-full h-[400px] md:h-[600px] bg-surface-container overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 right-6 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-primary text-xs font-bold shadow-lg border border-outline-variant/20">
          <Maximize className="w-4 h-4" />
          <span>1 / 8 PHOTOS</span>
        </div>
        
        {/* Floating Verified Badge */}
        <div className="absolute top-6 left-6 bg-surface-container-lowest shadow-2xl px-4 py-2 rounded-full flex items-center gap-2 text-secondary border border-secondary/10">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Annonce Vérifiée</span>
        </div>
      </section>

      <div className="px-6 md:px-12 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Title & Price */}
          <section className="space-y-4">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-on-surface-variant font-medium">
              <MapPin className="w-5 h-5 text-secondary/70" />
              <span>{property.neighborhood}, {property.location} • {property.distanceToUni} min du Campus</span>
            </div>
                <div className="flex items-baseline gap-2 pt-4">
              <span className="font-display text-5xl font-bold text-secondary tracking-tighter">{property.price} TND</span>
              <span className="text-on-surface-variant font-medium text-lg">/ mois</span>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/10 flex items-center gap-1.5">
                {property.type === 'Chambre en colocation' ? (
                  <>
                    <Users className="w-3.5 h-3.5 text-secondary" />
                    Colocation ({property.roommates?.count || 2} personnes)
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-secondary" />
                    {property.type === 'Studio' ? 'Studio Individuel (1 personne)' : 'Logement Individuel (1 personne)'}
                  </>
                )}
              </span>
              <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-secondary/10">Charges comprises</span>
              <span className="bg-surface-container text-on-surface px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-outline-variant/30">Éligible APL</span>
            </div>
          </section>

          {/* Bento Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Surface', value: `${property.surface} m²`, icon: Maximize },
              { 
                label: 'Mode', 
                value: property.type === 'Chambre en colocation' ? 'Colocation' : '1 Personne', 
                icon: property.type === 'Chambre en colocation' ? Users : User 
              },
              { label: 'Meublé', value: 'Oui', icon: Armchair },
              { label: 'Étage', value: '2ème', icon: Layers },
            ].map((stat, i) => (
              <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 ambient-shadow flex flex-col items-center justify-center text-center gap-3">
                <stat.icon className="w-8 h-8 text-primary" />
                <div>
                  <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">{stat.label}</div>
                  <div className="font-display text-xl font-bold text-primary">{stat.value}</div>
                </div>
              </div>
            ))}
          </section>

          {/* Description */}
          <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 ambient-shadow">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">
              {property.type === 'Chambre en colocation' 
                ? 'À propos de la chambre' 
                : property.type === 'Studio' 
                  ? 'À propos du studio' 
                  : 'À propos du logement'}
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {property.description} Orientée plein sud, elle offre une très belle luminosité tout au long de la journée.
            </p>
            <button className="text-secondary font-bold text-sm mt-6 hover:underline flex items-center gap-1 group">
              Lire la suite 
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </section>

          {/* Amenities Grid */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl font-bold text-primary">Équipements inclus</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Wifi Fibre', icon: Wifi },
                { name: 'Machine à laver', icon: WashingMachine },
                { name: 'Cuisine équipée', icon: Refrigerator },
                { name: 'Sécurité 24/7', icon: Shield },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10">
                  <item.icon className="w-6 h-6 text-secondary mb-3" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase text-center">{item.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Roommates Card (STRICTLY ONLY for Colocation) */}
          {property.type === 'Chambre en colocation' && property.roommates && property.roommates.count > 0 && (
            <section className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 ambient-shadow">
              <h2 className="font-display text-2xl font-bold text-primary mb-6">La Colocation</h2>
              <div 
                className="flex items-center gap-6 mb-6 bg-surface-bright p-5 rounded-xl border border-outline-variant/20 select-none"
              >
                <div className="flex -space-x-4">
                  {(() => {
                    // Parse names from details string e.g. "Faten, Farah • Étudiantes"
                    const detailsPart = (property.roommates.details || '').split('•')[0];
                    const roommateNames = detailsPart
                      .split(',')
                      .map(n => n.trim())
                      .filter(Boolean);
                    const avatarUrls = property.roommates.avatars || [];
                    const colors = ['bg-primary', 'bg-secondary', 'bg-indigo-600', 'bg-rose-500'];
                    return roommateNames.map((name, i) => {
                      const avatarSrc = avatarUrls[i] && avatarUrls[i].startsWith('http') ? avatarUrls[i] : null;
                      return (
                        <div 
                          key={i} 
                          onClick={() => navigate(`/student/${name.toLowerCase()}`)}
                          className={cn(
                            "w-12 h-12 rounded-full border-4 border-surface-container-lowest overflow-hidden cursor-pointer hover:scale-110 hover:z-20 active:scale-95 transition-all shadow-md",
                            !avatarSrc && (colors[i % colors.length])
                          )}
                          title={`Voir le profil de ${name}`}
                        >
                          {avatarSrc ? (
                            <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
                <div>
                  <div className="font-bold text-lg text-primary">{property.roommates.count} colocataires actuels</div>
                  <div className="text-on-surface-variant font-medium text-sm flex flex-wrap items-center gap-1 mt-1">
                    {(() => {
                      const detailsPart = (property.roommates.details || '').split('•')[0];
                      const roommateNames = detailsPart
                        .split(',')
                        .map(n => n.trim())
                        .filter(Boolean);
                      const suffix = (property.roommates.details || '').includes('•')
                        ? property.roommates.details.split('•')[1]?.trim()
                        : 'Étudiantes';
                      return (
                        <>
                          {roommateNames.map((name, idx) => (
                            <span key={name} className="inline-flex items-center">
                              <button
                                onClick={() => navigate(`/student/${name.toLowerCase()}`)}
                                className="text-secondary hover:text-secondary/80 hover:underline font-bold transition-colors cursor-pointer"
                              >
                                {name}
                              </button>
                              {idx < roommateNames.length - 1 && <span className="text-outline font-normal mx-1.5">•</span>}
                            </span>
                          ))}
                          {suffix && <span className="text-outline font-normal ml-1">• {suffix}</span>}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                Ambiance calme et studieuse. Nous recherchons une personne respectueuse, propre et conviviale pour partager des moments de temps en temps.
              </p>
            </section>
          )}

          {/* Area Section (Map & Commute Estimations) */}
          <AreaMapSection property={property} />
        </div>

        {/* Right Column: Landlord & CTA */}
        <div className="lg:col-span-4 space-y-6">
          <section className="sticky top-24 space-y-6">
            {/* Landlord Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/30 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-xl font-bold">Score Propriétaire</h3>
                <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center font-display text-2xl font-bold shadow-lg ring-4 ring-secondary/10">
                  {property.landlord.score}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-outline-variant/10">
                <img 
                  src={property.landlord.avatar} 
                  alt={property.landlord.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-outline-variant/20"
                />
                <div>
                  <div className="font-bold text-lg">{property.landlord.name}</div>
                  <div className="text-on-surface-variant text-sm font-medium">Membre depuis {property.landlord.memberSince} • {property.landlord.reviewsCount} avis</div>
                </div>
              </div>

              {/* Stats Bars */}
              <div className="space-y-5 mb-8">
                {[
                  { label: "Annonce exacte", score: 5.0 },
                  { label: "Communication", score: 4.8 },
                  { label: "Réactivité", score: 4.9 },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-on-surface-variant">{s.label}</span>
                      <span className="text-secondary">{s.score}</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: `${(s.score / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => navigate(`/student/${property.landlord.id || property.landlord.name.split(' ')[0].toLowerCase()}`)}
                  className="w-full bg-secondary text-on-secondary font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl hover:bg-secondary/90 active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" /> Contacter le propriétaire
                </button>
                <button className="w-full bg-white border-2 border-outline-variant text-primary font-bold py-4 rounded-xl transition-all hover:border-secondary hover:text-secondary group flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 group-hover:text-secondary" /> Déposer un dossier
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
