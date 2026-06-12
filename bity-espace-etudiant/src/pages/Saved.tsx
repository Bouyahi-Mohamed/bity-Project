import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Filter, MapPin, Maximize } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { authFetch, requireAuth, mapBackendAdToProperty } from '@/src/lib/api';
import { Property } from '@/src/types';

export default function SavedPage() {
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchSavedAds = async () => {
    try {
      const res = await authFetch('/student/saved');
      if (res.ok) {
        const data = await res.json();
        if (data.savedAds) {
          const mapped = data.savedAds.map((ad: any) => mapBackendAdToProperty(ad));
          setProperties(mapped);
        }
      }
    } catch (error) {
      console.error('Error fetching saved ads:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    requireAuth();
    fetchSavedAds();
  }, []);

  const handleUnsave = async (adId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await authFetch('/student/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== adId));
      }
    } catch (error) {
      console.error('Error unsaving ad:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-bold uppercase tracking-wider text-sm animate-pulse">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight">Annonces Sauvegardées</h1>
        <p className="text-on-surface-variant text-lg font-medium">Retrouvez ici toutes les propriétés qui ont retenu votre attention dans le Grand Tunis.</p>
      </div>

      {/* Filter/Sort Bar */}
      <div className="flex flex-wrap gap-4 mb-12 items-center justify-between bg-surface-container-lowest/50 backdrop-blur-md p-5 rounded-2xl border border-outline-variant/30 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button className="px-6 py-2.5 rounded-full bg-secondary text-on-secondary text-xs font-bold uppercase tracking-wider shadow-lg">
            Tout ({properties.length})
          </button>
        </div>
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-secondary font-bold text-xs uppercase tracking-wider px-6 py-2.5 border border-outline-variant/50 rounded-xl transition-all">
          <Filter className="w-4 h-4" /> Filtrer
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
          <p className="text-on-surface-variant font-medium text-lg">Aucune annonce sauvegardée pour le moment.</p>
          <Link 
            to="/"
            className="mt-4 inline-block bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all shadow-md"
          >
            Explorer les annonces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-outline-variant/20 group cursor-pointer"
            >
              <Link to={`/property/${property.id}`} className="block h-full">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.imageUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
                    alt={property.title} 
                  />
                  <div 
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg z-10 hover:scale-110 active:scale-95 transition-all" 
                    onClick={(e) => handleUnsave(property.id, e)}
                  >
                    <Heart className="w-5 h-5 text-error fill-current" />
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-display text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">{property.title}</h3>
                    <span className="font-display text-xl font-bold text-secondary whitespace-nowrap">{property.price} TND</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-on-surface-variant text-sm font-medium">
                    <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.location}
                  </div>

                  <div className="flex gap-6 mt-6 border-t border-outline-variant/20 pt-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <Maximize className="w-4 h-4 text-secondary/70" /> {property.surface} m²
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
