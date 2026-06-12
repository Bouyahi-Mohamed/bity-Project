import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Info, ImagePlus, MapPin, Navigation, ShieldCheck, ArrowRight, Camera, FileUp, Bus, Train, TramFront, PlusCircle, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { requireAuth, authFetch } from '../lib/api';

const PublishListing = () => {
  // Protect route
  requireAuth();

  const navigate = useNavigate();
  
  // State for form inputs
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [distanceToFac, setDistanceToFac] = useState('');
  const [transportAccess, setTransportAccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const presetImages = [
    { name: 'Studio Moderne', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800' },
    { name: 'Appartement Lumineux', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chambre Cosy', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError('');
    setUploadLoading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const res = await authFetch('/ads/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors du téléchargement des images.");
      }

      const newUrls: string[] = data.imageUrls || [];
      setImages(prev => [...prev, ...newUrls]);
      setSuccess("Image(s) téléchargée(s) avec succès !");
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || "Impossible d'uploader les images.");
    } finally {
      setUploadLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!title.trim()) {
      setError("Le titre de l'annonce est obligatoire.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Le prix mensuel doit être supérieur à 0 DT.");
      return;
    }
    if (!location.trim()) {
      setError("La localisation précise est obligatoire (ex: Tunis, Lafayette).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        distanceToFac: distanceToFac ? Number(distanceToFac) : undefined,
        transportAccess,
        images,
      };

      const res = await authFetch('/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de la publication de l'annonce.");
      }

      setSuccess("Annonce publiée avec succès ! Redirection vers le tableau de bord...");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">Publier une annonce</h1>
          <p className="text-on-surface-variant text-lg">Remplissez les détails ci-dessous pour proposer votre logement aux étudiants.</p>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-error/5 border border-error/20 rounded-2xl p-5"
          >
            <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <span className="text-sm text-error font-semibold">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-5"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="text-sm text-emerald-800 font-semibold">{success}</span>
          </motion.div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Section 1: Information */}
          <section className="bg-white rounded-2xl border border-surface-container-highest p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-3">
              <Info className="text-secondary" /> Information de base
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Titre de l'annonce *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: S+1 Moderne à Lafayette proche faculté"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Prix Mensuel (Obligatoire) *</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      placeholder="Ex: 450"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base font-medium focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">DT/mois</div>
                  </div>
                  <p className="text-[11px] font-bold text-error flex items-center gap-2 mt-2">
                    <ShieldCheck size={14} className="shrink-0" /> Le "prix en privé" est strictement interdit sur bity.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Localisation précise (Ville, Quartier) *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Tunis, Lafayette ou Ariana, Menzah 5"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Description de l'annonce</label>
                <textarea 
                  placeholder="Décrivez les points forts de votre logement (surface, équipement, charges incluses, ambiance, etc.)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Photos */}
          <section className="bg-white rounded-2xl border border-surface-container-highest p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                <Camera className="text-secondary" /> Photos du Logement
              </h2>
              <span className="bg-secondary/10 px-3 py-1 rounded-full text-[10px] font-bold text-secondary">Obligatoire</span>
            </div>

            <div className="space-y-6">
              {/* Image Preview and Upload Zone */}
              <div className="grid grid-cols-1 md:gap-6">
          <div className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-surface-container-highest bg-surface-container-low hover:border-secondary hover:bg-secondary/5 transition-all flex flex-col items-center justify-center p-6 group cursor-pointer">
            <input 
              type="file" 
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploadLoading}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            {uploadLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                <span className="text-xs font-bold text-secondary uppercase">Téléchargement...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <FileUp size={28} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">Télécharger des photos</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Glissez-déposez ou cliquez pour parcourir</p>
                  <p className="text-[10px] text-on-surface-variant/60 mt-1 uppercase font-semibold">PNG, JPG, JPEG (Max 5Mo)</p>
                </div>
              </div>
            )}
          </div>

          {/* Gallery of uploaded images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-surface-container-high">
                  <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} className="w-full h-full object-cover" alt={`Image ${idx + 1}`} />
                  <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 bg-white/70 hover:bg-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

              </div>

              {/* Presets alternative */}
              <div className="space-y-3 pt-4 border-t border-surface-container-highest">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest block">Ou choisir un modèle de standing :</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {presetImages.map((preset) => (
            <button 
              key={preset.name}
              type="button" 
              onClick={() => setImages(prev => [...prev, preset.url])}
              className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all group ${images.includes(preset.url) ? 'border-secondary shadow-md scale-98' : 'border-surface-container-highest hover:border-secondary/50'}`}
            >
                      <img 
                        src={preset.url} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        alt={preset.name} 
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-3">
                        <span className="text-[10px] font-bold text-white uppercase">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
              <Info size={20} className="text-secondary shrink-0" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Des photos de qualité augmentent vos chances de louer rapidement. Préférez des photos lumineuses et dégagées.
              </p>
            </div>
          </section>



          {/* Section 3: Localization Details */}
          <section className="bg-white rounded-2xl border border-surface-container-highest p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-3">
              <MapPin className="text-secondary" /> Détails de proximité
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest font-semibold block">Transports à proximité</label>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setTransportAccess(true)}
                    className={`px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 border transition-all ${transportAccess ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-surface-container text-on-surface-variant border-surface-container-highest hover:bg-surface-container-high'}`}
                  >
                    <TramFront size={14} /> Accès Métro / Bus Direct
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTransportAccess(false)}
                    className={`px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 border transition-all ${!transportAccess ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-surface-container text-on-surface-variant border-surface-container-highest hover:bg-surface-container-high'}`}
                  >
                    Pas de transport direct
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Distance à pied vers la faculté (km)</label>
                 <input 
                  type="number" 
                  step="0.1"
                  placeholder="Ex: 0.8" 
                  value={distanceToFac}
                  onChange={(e) => setDistanceToFac(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all" 
                 />
              </div>
            </div>
          </section>

          {/* Section 4: Validation Documents */}
          <section className="bg-white rounded-2xl border border-surface-container-highest p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-3">
              <ShieldCheck className="text-secondary" /> Documents de Confiance (Sécurisé)
            </h2>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-4">
              <ShieldCheck className="text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                Vérification bity requise avant publication. Vos documents restent strictement confidentiels et cryptés.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <button type="button" className="w-full p-5 border border-surface-container-highest rounded-2xl flex items-center justify-between group hover:border-secondary/30 hover:bg-secondary/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center shrink-0 group-hover:bg-secondary/10 transition-colors">
                    <FileUp className="text-on-surface-variant group-hover:text-secondary transition-colors" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-primary">Titre de Propriété / Contrat</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium">Document validé (automatique)</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 size={16} />
                </div>
              </button>
            </div>
          </section>

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-secondary/30 hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Publication de votre annonce...</>
            ) : (
              <>
                Publier l'annonce
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default PublishListing;
