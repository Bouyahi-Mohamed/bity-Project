import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { PropertyCard } from '../components/PropertyCard';
import { BadgeCheck, PlusCircle, Star, Loader2, AlertCircle, Home } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { requireAuth, getUser, authFetch, mapBackendAdToProperty } from '../lib/api';
import { Property } from '../types';

const OwnerDashboard = () => {
  // Protect route
  requireAuth();

  const user = getUser();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyAds = async () => {
      try {
        const res = await authFetch('/ads/my-ads');
        if (!res.ok) {
          throw new Error('Impossible de charger vos annonces.');
        }
        const data = await res.json();
        const mapped = (data.ads || []).map((ad: any) => mapBackendAdToProperty(ad));
        setProperties(mapped);
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue lors de la récupération des annonces.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAds();
  }, []);

  const landlordName = user ? `${user.firstName} ${user.lastName}` : 'Propriétaire';
  const ratingScore = user?.rankingScore || 4.8;
  const ratingCount = user?.rankingCount || 12;

  // Calculate full/empty stars
  const fullStars = Math.floor(ratingScore);
  const hasHalfStar = ratingScore - fullStars >= 0.5;

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <section className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">Bonjour, {user?.firstName || 'Karim'}.</h1>
          <p className="text-on-surface-variant text-lg">Voici un aperçu de vos propriétés et de vos locataires.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Status Card */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-[0px_10px_40px_rgba(15,23,42,0.06)]"
            >
              <div className="flex items-center gap-6 z-10">
                <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center text-white shadow-inner">
                  <BadgeCheck size={48} fill="currentColor" fillOpacity={0.2} strokeWidth={2} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Statut du Compte</span>
                  <h2 className="text-2xl font-bold text-primary">Propriétaire Certifié</h2>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end z-10 border-t md:border-t-0 md:border-l border-surface-container-highest pt-6 md:pt-0 md:pl-10">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Score de Fiabilité</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{ratingScore}</span>
                  <span className="text-on-surface-variant font-medium">/ 5</span>
                </div>
                <div className="flex text-secondary mt-2">
                  {[...Array(5)].map((_, i) => {
                    const isFull = i < fullStars;
                    const isHalf = !isFull && i === fullStars && hasHalfStar;
                    return (
                      <Star 
                        key={i} 
                        size={16} 
                        fill="currentColor" 
                        fillOpacity={isFull ? 1 : isHalf ? 0.5 : 0.2} 
                        className="text-[#eab308]"
                      />
                    );
                  })}
                </div>
                <span className="text-[10px] text-on-surface-variant mt-1">({ratingCount} avis)</span>
              </div>
            </motion.section>

            {/* Action Button */}
            <Link 
              to="/publish"
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold uppercase tracking-widest rounded-xl py-5 flex items-center justify-center gap-3 shadow-lg shadow-secondary/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle size={24} />
              Publier une Annonce
            </Link>

            {/* Listings Section */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-xl font-bold text-primary">Mes Annonces</h3>
                <span className="text-sm font-bold text-on-surface-variant">{properties.length} annonce(s)</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 glass rounded-2xl">
                  <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                  <p className="text-sm font-semibold text-on-surface-variant">Chargement de vos annonces...</p>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 bg-error/5 border border-error/20 rounded-2xl p-6">
                  <AlertCircle className="w-6 h-6 text-error shrink-0" />
                  <p className="text-sm text-error font-semibold">{error}</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center glass rounded-2xl border border-surface-container-highest space-y-4">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <Home size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-primary">Aucune annonce publiée</h4>
                  <p className="text-sm text-on-surface-variant max-w-sm">
                    Vous n'avez pas encore publié d'annonce de logement étudiant. Commencez à publier dès maintenant !
                  </p>
                  <Link 
                    to="/publish"
                    className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all active:scale-95 shadow-md shadow-secondary/10"
                  >
                    <PlusCircle size={16} /> Publier ma première annonce
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (Placeholder for Sidebar Content like images show) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <div className="glass p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-primary">Conseils Premium</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Ajouter des photos professionnelles peut augmenter vos visites de 30%.
                </p>
                <div className="h-40 rounded-xl bg-surface-container overflow-hidden">
                   <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600" 
                    className="w-full h-full object-cover" 
                    alt="Interior inspiration" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;

