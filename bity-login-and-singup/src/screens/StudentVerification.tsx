import React, { useRef, useState } from 'react';
import { ChevronDown, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'motion/react';
import { useSignup } from '../context/SignupContext';

export default function StudentVerification() {
  const navigate = useNavigate();
  const { data, setField } = useSignup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setField('studentCardFile', file);
  };

  const handleSubmit = () => {
    if (!data.university) { setError("Veuillez sélectionner votre université."); return; }
    if (!data.studentCardFile) { setError("Veuillez uploader votre carte étudiante."); return; }
    setError('');
    navigate('/personal-details');
  };

  return (
    <Layout showBack>
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-display font-semibold text-on-surface">Vérification Étudiant</h2>
          <p className="text-on-surface-variant">Confirmez votre statut pour débloquer les avantages exclusifs.</p>

          <div className="flex items-center justify-center gap-2 mt-2 px-8">
            <div className="h-1 flex-grow rounded-full bg-secondary"></div>
            <div className="h-1 flex-grow rounded-full bg-secondary"></div>
            <div className="h-1 flex-grow rounded-full bg-surface-variant"></div>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-on-surface-variant px-2 font-bold">
            <span>Profil</span>
            <span className="text-secondary">ID Étudiant</span>
            <span>Succès</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* University select */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 premium-shadow">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface mb-3" htmlFor="university">
              Sélectionnez votre établissement
            </label>
            <div className="relative">
              <select
                id="university"
                value={data.university}
                onChange={e => setField('university', e.target.value)}
                className="w-full appearance-none bg-surface-bright border border-outline-variant/40 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-all cursor-pointer"
              >
                <option value="">Choisir une université...</option>
                <option value="sesame">Université Sesame</option>
                <option value="esprit">ESPRIT - École Supérieure</option>
                <option value="dauphine">Paris Dauphine - Tunis</option>
                <option value="autre">Autre établissement...</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* File upload */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 premium-shadow flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface">Carte étudiante</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Uploadez une photo claire de votre carte étudiante officielle (recto).
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {data.studentCardFile ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-700 truncate">{data.studentCardFile.name}</span>
              </div>
            ) : null}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 flex items-center justify-center gap-2 bg-surface-container-low border border-outline-variant/30 rounded-xl text-secondary font-semibold uppercase tracking-wider text-xs hover:bg-secondary/10 transition-colors"
            >
              <Upload className="w-4 h-4" />
              {data.studentCardFile ? 'Changer l\'image' : 'Uploader une image'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-on-surface-variant bg-surface-container-low/50 py-3 rounded-xl border border-outline-variant/20">
          <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Garantie de confidentialité des données</span>
        </div>

        {error && (
          <p className="text-sm text-error font-semibold text-center bg-error/5 border border-error/20 py-3 rounded-xl">{error}</p>
        )}

        <div className="flex flex-col gap-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-semibold uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all"
          >
            Soumettre pour vérification
          </motion.button>
          <button className="text-on-surface-variant text-sm font-medium hover:text-secondary transition-colors">
            Besoin d'aide ?
          </button>
        </div>
      </div>
    </Layout>
  );
}
