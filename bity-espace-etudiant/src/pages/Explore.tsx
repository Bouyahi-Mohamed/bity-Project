import React from 'react';
import {
  Search, Filter, MapPin, Maximize, Train, School, Heart, CheckCircle2,
  Wifi, Wind, Thermometer, WashingMachine, Armchair, Bath, Clock,
  Check, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Property } from '@/src/types';
import { authFetch, requireAuth, mapBackendAdToProperty } from '@/src/lib/api';
import { cn } from '@/src/lib/utils';

export default function ExplorePage() {
  const [isOpen, setIsOpen] = React.useState(false);

  // Search query state
  const [searchQuery, setSearchQuery] = React.useState('');

  // Primary filter panel state (staged relative state)
  const [minPrice, setMinPrice] = React.useState<number>(100);
  const [maxPrice, setMaxPrice] = React.useState<number>(1200);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [maxDistance, setMaxDistance] = React.useState<number | null>(null);
  const [selectedTransports, setSelectedTransports] = React.useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = React.useState<string>('');
  const [genderPref, setGenderPref] = React.useState<string>('');

  // Applied filter state (filters are applied upon clicking "Apply filters")
  const [appliedFilters, setAppliedFilters] = React.useState({
    minPrice: 100,
    maxPrice: 1200,
    selectedTypes: [] as string[],
    maxDistance: null as number | null,
    selectedTransports: [] as string[],
    selectedAmenities: [] as string[],
    selectedAvailability: '' as string,
    genderPref: '' as string
  });

  // Handle Quick Filter immediate toggle actions
  const toggleQuickBudget = () => {
    const active = appliedFilters.maxPrice === 800;
    const nextMax = active ? 1200 : 800;
    setMaxPrice(nextMax);
    setAppliedFilters(prev => ({ ...prev, maxPrice: nextMax }));
  };

  const toggleQuickDistance = () => {
    const active = appliedFilters.maxDistance === 15;
    const nextDist = active ? null : 15;
    setMaxDistance(nextDist);
    setAppliedFilters(prev => ({ ...prev, maxDistance: nextDist }));
  };

  const toggleQuickTransport = () => {
    const active = appliedFilters.selectedTransports.includes('metro');
    const nextTransports = active ? [] : ['metro'];
    setSelectedTransports(nextTransports);
    setAppliedFilters(prev => ({ ...prev, selectedTransports: nextTransports }));
  };

  const toggleQuickColoc = () => {
    const active = appliedFilters.selectedTypes.includes('Colocation');
    const nextTypes = active ? [] : ['Colocation'];
    setSelectedTypes(nextTypes);
    setAppliedFilters(prev => ({ ...prev, selectedTypes: nextTypes }));
  };

  // Reset all staged and applied states
  const handleReset = () => {
    setMinPrice(100);
    setMaxPrice(1200);
    setSelectedTypes([]);
    setMaxDistance(null);
    setSelectedTransports([]);
    setSelectedAmenities([]);
    setSelectedAvailability('');
    setGenderPref('');

    setAppliedFilters({
      minPrice: 100,
      maxPrice: 1200,
      selectedTypes: [],
      maxDistance: null,
      selectedTransports: [],
      selectedAmenities: [],
      selectedAvailability: '',
      genderPref: ''
    });
  };

  // Apply staged state to active filter criteria
  const handleApply = () => {
    setAppliedFilters({
      minPrice,
      maxPrice,
      selectedTypes,
      maxDistance,
      selectedTransports,
      selectedAmenities,
      selectedAvailability,
      genderPref
    });
    setIsOpen(false);
  };

  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [savedAdIds, setSavedAdIds] = React.useState<string[]>([]);
  const [stats, setStats] = React.useState<{ activeAdsCount: number; savedAdsCount: number; unreadNotificationsCount: number } | null>(null);

  const fetchStats = async () => {
    try {
      const res = await authFetch('/student/dashboard-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const fetchSavedAds = async () => {
    try {
      const res = await authFetch('/student/saved');
      if (res.ok) {
        const data = await res.json();
        if (data.savedAds) {
          setSavedAdIds(data.savedAds.map((ad: any) => ad._id));
        }
      }
    } catch (error) {
      console.error('Error loading saved ads:', error);
    }
  };

  const handleToggleSave = async (adId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await authFetch('/student/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.savedAds) {
          setSavedAdIds(data.savedAds);
          fetchStats();
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  React.useEffect(() => {
    if (localStorage.getItem('bity_token')) {
      fetchStats();
      fetchSavedAds();
    }
  }, []);

  React.useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) {
          queryParams.append('query', searchQuery);
        }
        if (appliedFilters.maxPrice) {
          queryParams.append('budget', appliedFilters.maxPrice.toString());
        }
        if (appliedFilters.maxDistance) {
          queryParams.append('distance', appliedFilters.maxDistance.toString());
        }
        if (appliedFilters.selectedTransports.length > 0) {
          queryParams.append('transport', 'true');
        }

        const res = await authFetch(`/student/search?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ads) {
            const mapped = data.ads.map((ad: any) => mapBackendAdToProperty(ad));
            setProperties(mapped);
          }
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchQuery, appliedFilters.maxPrice, appliedFilters.maxDistance, appliedFilters.selectedTransports]);

  // Reactive dynamic filtering for the properties grid
  const filteredProperties = React.useMemo(() => {
    return properties.filter(property => {
      // 1. Pricing range (minPrice)
      if (property.price < appliedFilters.minPrice) {
        return false;
      }

      // 2. Accommodation structural type
      if (appliedFilters.selectedTypes.length > 0) {
        const matchesType = appliedFilters.selectedTypes.some(t => {
          if (t === 'Studio' && property.type === 'Studio') return true;
          if (t === 'Appartement' && property.type === 'Logement entier') return true;
          if (t === 'Chambre' && property.type === 'Chambre en colocation') return true;
          if (t === 'Colocation' && property.roommates !== undefined) return true;
          return false;
        });
        if (!matchesType) return false;
      }

      // 3. Amenities content mapping
      if (appliedFilters.selectedAmenities.length > 0) {
        const textToSearch = (
          property.title + ' ' +
          property.description + ' ' +
          property.features.join(' ')
        ).toLowerCase();

        const matchesAllAmenities = appliedFilters.selectedAmenities.every(amenityId => {
          if (amenityId === 'wifi') return textToSearch.includes('wifi') || textToSearch.includes('fibre');
          if (amenityId === 'clim') return textToSearch.includes('clim') || textToSearch.includes('climatisation');
          if (amenityId === 'chauffage') return textToSearch.includes('chauffage') || textToSearch.includes('chaud');
          if (amenityId === 'machine') return textToSearch.includes('laver') || textToSearch.includes('washing');
          if (amenityId === 'meuble') return textToSearch.includes('meublé') || textToSearch.includes('équipé') || property.features.includes('Meublé');
          if (amenityId === 'sdb_privee') return textToSearch.includes('sdb') || textToSearch.includes('bain privée') || textToSearch.includes('privative');
          return false;
        });

        if (!matchesAllAmenities) return false;
      }

      // 4. Availability / Gender preferences search description check
      if (appliedFilters.genderPref) {
        const desc = property.description.toLowerCase();
        if (appliedFilters.genderPref === 'female' && !(desc.includes('fille') || desc.includes('femme') || desc.includes('étudiante'))) {
          return false;
        }
        if (appliedFilters.genderPref === 'male' && !(desc.includes('garçon') || desc.includes('homme') || desc.includes('étudiant'))) {
          return false;
        }
      }

      return true;
    });
  }, [properties, appliedFilters]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          
          
          
        </motion.div>
      )}

      {/* Search & Hero */}
      <section className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl md:text-5xl text-primary font-bold mb-8 hidden md:block"
        >
          Trouvez votre espace idéal
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une ville, faculté ou quartier..."
              className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl py-4 pl-12 pr-4 font-sans text-lg text-on-surface focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all ambient-shadow h-14"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "px-8 rounded-xl font-semibold h-14 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg border",
              isOpen
                ? "bg-secondary-container/20 text-secondary border-secondary/30 ring-4 ring-secondary/10"
                : "bg-secondary text-on-secondary hover:bg-secondary/90 border-transparent"
            )}
          >
            <Filter className="w-5 h-5" />
            <span>Filtres Avancés</span>
          </button>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl p-6 md:p-8 mt-4 shadow-xl space-y-8 relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                  {/* segment 1: pricing slider */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      1. Gamme de Prix (TND)
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Budget Min</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="100"
                            max="1500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Math.max(100, Number(e.target.value)))}
                            className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 font-bold transition-all"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">TND</span>
                        </div>
                      </div>
                      <div className="text-on-surface-variant font-bold mt-5">-</div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Budget Max</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="100"
                            max="1500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Math.min(1500, Number(e.target.value)))}
                            className="w-full bg-surface-container/30 border border-outline-variant/30 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 font-bold transition-all"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">TND</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <input
                        type="range"
                        min="100"
                        max="1500"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
                      />
                      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                        <span>100 TND</span>
                        <span className="text-secondary">Max sélectionné: {maxPrice} TND</span>
                        <span>1500 TND</span>
                      </div>
                    </div>
                  </div>

                  {/* segment 2: logement types */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      2. Type de Logement
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'Studio', label: 'Studio' },
                        { id: 'Appartement', label: 'Appartement (S+1/2)' },
                        { id: 'Chambre', label: 'Chambre seule' },
                        { id: 'Colocation', label: 'Colocation' },
                      ].map(type => {
                        const isSelected = selectedTypes.includes(type.id);
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTypes(selectedTypes.filter(t => t !== type.id));
                              } else {
                                setSelectedTypes([...selectedTypes, type.id]);
                              }
                            }}
                            className={cn(
                              "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center",
                              isSelected
                                ? "bg-secondary-container/10 border-secondary text-secondary shadow-sm"
                                : "bg-surface-container-low/60 border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* segment 3: distance from faculty */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      3. Distance de la Faculté
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 5, label: '< 5 min' },
                        { id: 10, label: '< 10 min' },
                        { id: 20, label: '< 20 min' },
                      ].map((dist) => {
                        const isSelected = maxDistance === dist.id;
                        return (
                          <button
                            key={dist.id}
                            type="button"
                            onClick={() => setMaxDistance(isSelected ? null : dist.id)}
                            className={cn(
                              "py-2 px-4 rounded-full border text-xs font-bold transition-all",
                              isSelected
                                ? "bg-secondary text-on-secondary border-secondary"
                                : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {dist.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* segment 4: transport options */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      4. Options de Transport
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'metro', label: 'Proche Métro' },
                        { id: 'bus', label: 'Proche Bus' },
                        { id: 'train', label: 'Proche Train' },
                      ].map((trans) => {
                        const isSelected = selectedTransports.includes(trans.id);
                        return (
                          <button
                            key={trans.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedTransports(selectedTransports.filter(t => t !== trans.id));
                              } else {
                                setSelectedTransports([...selectedTransports, trans.id]);
                              }
                            }}
                            className={cn(
                              "py-2 px-4 rounded-full border text-xs font-bold transition-all",
                              isSelected
                                ? "bg-secondary text-on-secondary border-secondary"
                                : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {trans.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* segment 5: amenities */}
                  <div className="space-y-4 lg:col-span-2">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      5. Équipements & Commodités
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { id: 'wifi', label: 'WiFi Fibre', icon: Wifi },
                        { id: 'clim', label: 'Climatisation', icon: Wind },
                        { id: 'chauffage', label: 'Chauffage', icon: Thermometer },
                        { id: 'machine', label: 'Machine à laver', icon: WashingMachine },
                        { id: 'meuble', label: 'Meublé', icon: Armchair },
                        { id: 'sdb_privee', label: 'Salle de bain privée', icon: Bath },
                      ].map((amenity) => {
                        const isSelected = selectedAmenities.includes(amenity.id);
                        const IconComponent = amenity.icon;
                        return (
                          <button
                            key={amenity.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity.id));
                              } else {
                                setSelectedAmenities([...selectedAmenities, amenity.id]);
                              }
                            }}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all text-left",
                              isSelected
                                ? "bg-secondary/10 border-secondary text-secondary shadow-sm"
                                : "bg-surface-container-low/50 border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            <IconComponent className={cn("w-4 h-4 shrink-0ID", isSelected ? "text-secondary" : "text-outline")} />
                            <span>{amenity.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* segment 6: availability */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      6. Disponibilité
                    </h4>
                    <div className="flex gap-2">
                      {[
                        { id: 'now', label: 'Immédiate' },
                        { id: 'next_month', label: 'Mois prochain' },
                      ].map((opt) => {
                        const isSelected = selectedAvailability === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedAvailability(isSelected ? '' : opt.id)}
                            className={cn(
                              "py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex-1 text-center",
                              isSelected
                                ? "bg-secondary text-on-secondary border-secondary shadow-sm"
                                : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* segment 7: gender preference */}
                  <div className="space-y-4">
                    <h4 className="font-display font-semibold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wider text-secondary">
                      <span className="w-1.5 h-4 bg-secondary rounded-full"></span>
                      7. Préférence de Genre
                    </h4>
                    <div className="flex gap-2">
                      {[
                        { id: 'male', label: 'Hommes uniquement' },
                        { id: 'female', label: 'Femmes uniquement' },
                      ].map((opt) => {
                        const isSelected = genderPref === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setGenderPref(isSelected ? '' : opt.id)}
                            className={cn(
                              "py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex-1 text-center",
                              isSelected
                                ? "bg-secondary text-on-secondary border-secondary shadow-sm"
                                : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high"
                            )}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* segment 8: control buttons row */}
                <div className="flex items-center justify-between border-t border-outline-variant/20 pt-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-xs uppercase tracking-wider hover:bg-surface-container-high active:scale-95 transition-all"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-secondary/90 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Appliquer les filtres
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={toggleQuickBudget}
            className={cn(
              "whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full border transition-all uppercase tracking-wider",
              appliedFilters.maxPrice === 800
                ? "bg-secondary text-on-secondary border-secondary shadow-sm"
                : "bg-secondary-container/10 text-secondary border-secondary/20 hover:bg-secondary-container/20"
            )}
          >
            Budget : <span className={cn(appliedFilters.maxPrice === 800 ? "text-on-secondary" : "text-secondary font-normal lowercase")}>Max 800 TND</span>
          </button>

          <button
            onClick={toggleQuickDistance}
            className={cn(
              "whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full border transition-all uppercase tracking-wider",
              appliedFilters.maxDistance === 15
                ? "bg-secondary text-on-secondary border-secondary"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
            )}
          >
            Distance Fac : <span className={cn(appliedFilters.maxDistance === 15 ? "text-on-secondary" : "text-on-surface-variant font-normal lowercase")}>&lt; 15 min</span>
          </button>

          <button
            onClick={toggleQuickTransport}
            className={cn(
              "whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full border transition-all uppercase tracking-wider",
              appliedFilters.selectedTransports.includes('metro')
                ? "bg-secondary text-on-secondary border-secondary"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
            )}
          >
            Transport : <span className={cn(appliedFilters.selectedTransports.includes('metro') ? "text-on-secondary" : "text-on-surface-variant font-normal lowercase")}>Proche Métro</span>
          </button>

          <button
            onClick={toggleQuickColoc}
            className={cn(
              "whitespace-nowrap text-xs font-bold px-4 py-2 rounded-full border transition-all uppercase tracking-wider",
              appliedFilters.selectedTypes.includes('Colocation')
                ? "bg-secondary text-on-secondary border-secondary"
                : "bg-surface-container text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high"
            )}
          >
            Colocation
          </button>
        </div>
      </section>

      {/* Results */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-display text-2xl font-semibold text-on-surface">Résultats recommandés</h2>
          <span className="text-on-surface-variant font-medium">{filteredProperties.length} propriétés</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden ambient-shadow h-[420px] animate-pulse">
                <div className="h-60 bg-surface-container-low" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-surface-container-low rounded w-1/3" />
                  <div className="h-6 bg-surface-container-low rounded w-3/4" />
                  <div className="h-4 bg-surface-container-low rounded w-1/2" />
                  <div className="h-8 bg-surface-container-low rounded w-full pt-4 border-t border-outline-variant/20" />
                </div>
              </div>
            ))
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
              <p className="text-on-surface-variant font-medium text-lg">Aucun logement ne correspond aux critères sélectionnés.</p>
              <button
                onClick={handleReset}
                className="mt-4 text-xs font-bold text-secondary uppercase tracking-widest hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredProperties.map((property, index) => (
              <motion.article
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 ambient-shadow overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 relative"
              >
                <Link to={`/property/${property.id}`}>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-secondary/10">
                      <CheckCircle2 className="w-4 h-4 text-secondary" />
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Vérifié par bity</span>
                    </div>
                    <button
                      onClick={(e) => handleToggleSave(property.id, e)}
                      className="absolute top-4 right-4 text-white hover:text-error transition-colors drop-shadow-md z-10"
                    >
                      <Heart className={cn("w-6 h-6", savedAdIds.includes(property.id) && "text-error fill-current")} />
                    </button>
                  </div>

                  <div className="p-6">
                    <span className="bg-surface-variant text-on-surface-variant text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-3 inline-block">
                      {property.type}
                    </span>

                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-xl font-bold text-primary truncate pr-4">{property.title}</h3>
                      <div className="text-right">
                        <span className="font-display text-xl font-bold text-secondary block leading-none">{property.price}</span>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">TND / mois</span>
                      </div>
                    </div>

                    <p className="text-on-surface-variant text-sm mb-4 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.location}
                    </p>

                    <div className="flex items-center gap-5 border-t border-outline-variant/20 pt-4">
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
                        <Maximize className="w-4 h-4 text-secondary/70" /> {property.surface}m²
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
                        <Train className="w-4 h-4 text-secondary/70" /> {property.transportTime} min
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
                        <School className="w-4 h-4 text-secondary/70" /> {property.distanceToUni} min
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

