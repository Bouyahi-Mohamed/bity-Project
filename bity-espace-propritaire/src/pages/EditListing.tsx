import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { BadgeCheck, Trash2, ImagePlus, Info, Save, Loader2, AlertCircle, CheckCircle2, MapPin, Bus, Train, TramFront, FileUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { requireAuth, authFetch } from '../lib/api';

const EditListing = () => {
  // Protect route
  requireAuth();

  const { id } = useParams();
  const navigate = useNavigate();

  // State for form inputs
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [distanceToFac, setDistanceToFac] = useState('');
  const [transportAccess, setTransportAccess] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState('ACTIVE');

  // UI states
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await authFetch(`/ads/${id}`);
        if (!res.ok) {
          throw new Error("Impossible de récupérer les détails de cette annonce.");
        }
        const data = await res.json();
        const ad = data.ad;
        if (ad) {
          setTitle(ad.title || '');
          setPrice(ad.price ? ad.price.toString() : '');
          setLocation(ad.location || '');
          setDescription(ad.description || '');
          setDistanceToFac(ad.distanceToFac ? ad.distanceToFac.toString() : '');
          setTransportAccess(ad.transportAccess || false);
          setImages(ad.images?.length ? ad.images : (ad.image ? [ad.image] : []));
          setStatus(ad.status || 'ACTIVE');
        }
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAd();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim()) {
      setError("Le titre de l'annonce est obligatoire.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setError("Le prix mensuel doit être supérieur à 0 DT.");
      return;
    }
    if (!location.trim()) {
      setError("La localisation précise est obligatoire.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        distanceToFac: distanceToFac ? Number(distanceToFac) : undefined,
        transportAccess,
        images,
        status
      };

      const res = await authFetch(`/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Impossible de mettre à jour l'annonce.");
      }

      setSuccess("Annonce mise à jour avec succès !");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    setDeleting(true);

    try {
      const res = await authFetch(`/ads/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Impossible de supprimer l'annonce.");
      }

      setSuccess("Annonce supprimée avec succès !");
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la suppression.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-32 gap-3 max-w-2xl mx-auto glass rounded-3xl">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          <p className="text-sm font-semibold text-on-surface-variant font-display">Chargement des données de l'annonce...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto space-y-8">
        {/* Header & Status */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">Modifier mon Annonce</h1>
              <p className="text-on-surface-variant text-lg truncate max-w-md">{title}</p>
            </div>
            <div className="self-start flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 shrink-0">
              <BadgeCheck className="text-secondary" size={20} fill="currentColor" fillOpacity={0.2} />
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Propriétaire Certifié</span>
            </div>
          </div>

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

          {/* Visibility Toggle */}
          <div className="bg-white p-6 rounded-2xl border border-surface-container-highest flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-primary">Statut de Visibilité</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                {status === 'ACTIVE' ? 'Actuellement visible par tous les étudiants' : 'Masquée / Réservée'}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setStatus(status === 'ACTIVE' ? 'PÉRIMÉE' : 'ACTIVE')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${status === 'ACTIVE' ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'}`}
              >
                {status === 'ACTIVE' ? 'Active' : 'Désactivée'}
              </button>
            </div>
          </div>
        </section>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Main Info */}
          <section className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-primary">Informations de base</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Titre de l'annonce *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: S+1 Moderne à Lafayette"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Prix Mensuel (DT) *</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      required
                      placeholder="Ex: 650"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base font-bold focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">DT/mois</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Localisation précise *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Tunis, Lafayette"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Description</label>
                <textarea 
                  placeholder="Points forts du logement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-surface-container-low border border-surface-container-highest rounded-xl px-5 py-4 text-base focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-primary">Photos du Logement</h2>
            
            <div className="space-y-6">
              {/* Image Preview and Upload Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Card */}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            </div>

            <div className="flex gap-4 p-4 bg-secondary/5 rounded-xl border border-secondary/10">
              <Info className="text-secondary shrink-0" size={20} />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Des images claires augmentent votre taux d'intérêt de 3x auprès des étudiants.
              </p>
            </div>
          </section>

          {/* Proximity and details */}
          <section className="bg-white rounded-2xl p-6 border border-surface-container-highest shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-primary">Détails de proximité</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest font-semibold block">Accès aux transports</label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setTransportAccess(true)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${transportAccess ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-surface-container text-on-surface-variant border-transparent'}`}
                  >
                    Transports directs (Métro/Bus)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setTransportAccess(false)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${!transportAccess ? 'bg-secondary/10 text-secondary border-secondary/30' : 'bg-surface-container text-on-surface-variant border-transparent'}`}
                  >
                    Non direct
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Distance à pied vers faculté (km)</label>
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

          {/* Actions */}
          <div className="space-y-4 pb-12">
            <button 
              type="submit"
              disabled={submitting || deleting}
              className="w-full bg-secondary text-white font-bold uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-secondary/30 hover:bg-secondary/90 transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer disabled:opacity-75"
            >
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
              ) : (
                <>
                  <Save size={20} />
                  Enregistrer les modifications
                </>
              )}
            </button>

            {/* Delete Zone */}
            <div className="pt-6 border-t border-surface-container-highest">
              {confirmDelete ? (
                <div className="bg-error/5 border border-error/20 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-error text-lg flex items-center gap-2">
                    <Trash2 size={20} /> Confirmation de suppression
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Êtes-vous absolument sûr de vouloir supprimer définitivement cette annonce ? Cette action est irréversible.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <button 
                      type="button" 
                      onClick={() => setConfirmDelete(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-all"
                    >
                      Annuler
                    </button>
                    <button 
                      type="button" 
                      disabled={deleting}
                      onClick={handleDelete}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-error text-white hover:bg-error/90 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Oui, supprimer définitivement'}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-4 text-error font-bold uppercase tracking-widest text-sm border border-error/20 rounded-xl hover:bg-error/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={16} /> Supprimer l'annonce
                </button>
              )}
            </div>

            <p className="text-[11px] text-center text-on-surface-variant font-medium leading-relaxed px-12">
              Toute modification importante sur le prix ou la localisation peut faire l'objet d'une re-validation rapide par l'équipe bity.
            </p>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditListing;
