import React, { useRef, useState } from 'react';
import { FileText, ShieldCheck, CheckCircle2, Upload, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'motion/react';
import { useSignup } from '../context/SignupContext';

export default function LandlordVerification() {
  const navigate = useNavigate();
  const { data, setField } = useSignup();
  const cinRef = useRef<HTMLInputElement>(null);
  const billRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!data.cinFile) { setError("Veuillez uploader votre CIN."); return; }
    if (!data.utilityBillFile) { setError("Veuillez uploader un justificatif de propriété (STEG/SONEDE ou titre)."); return; }
    setError('');
    navigate('/personal-details');
  };

  return (
    <Layout showBack>
      <div className="w-full flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-3xl font-display font-semibold text-on-surface">Vérification Propriétaire</h2>
          <p className="text-on-surface-variant">Afin de garantir la sécurité, nous devons vérifier votre identité et la propriété du bien.</p>

          <div className="flex items-center justify-center gap-2 mt-2 px-8">
            <div className="h-1 flex-grow rounded-full bg-secondary"></div>
            <div className="h-1 flex-grow rounded-full bg-secondary"></div>
            <div className="h-1 flex-grow rounded-full bg-surface-variant"></div>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-wider text-on-surface-variant px-2 font-bold">
            <span>Profil</span>
            <span className="text-secondary">Vérification</span>
            <span>Détails</span>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/30 premium-shadow">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase text-on-surface mb-1">Sécurité Garantie</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Vos documents sont chiffrés. Ils servent uniquement à la vérification et ne seront jamais publics.
            </p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 premium-shadow flex flex-col gap-6">

          {/* CIN Upload */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface mb-1">Carte d'Identité (CIN)</h3>
                <p className="text-sm text-on-surface-variant font-medium">Photo recto de votre CIN</p>
              </div>
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <input ref={cinRef} type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" className="hidden"
              onChange={e => setField('cinFile', e.target.files?.[0] || null)} />
            {data.cinFile ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-700 truncate">{data.cinFile.name}</span>
              </div>
            ) : null}
            <button
              onClick={() => cinRef.current?.click()}
              className="w-full py-6 flex flex-col items-center justify-center gap-3 bg-surface-container-low border-2 border-dashed border-outline-variant/40 rounded-2xl text-secondary hover:bg-secondary/5 hover:border-secondary transition-all"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {data.cinFile ? 'Changer la CIN' : 'Ajouter votre CIN'}
              </span>
              <span className="text-xs text-on-surface-variant">Formats : PDF, JPG, PNG (Max 5MB)</span>
            </button>
          </div>

          {/* Utility bill / Property title Upload */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface mb-1">Justificatif de Propriété</h3>
                <p className="text-sm text-on-surface-variant font-medium">Titre Bleu ou Facture STEG/SONEDE récente</p>
              </div>
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <input ref={billRef} type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" className="hidden"
              onChange={e => setField('utilityBillFile', e.target.files?.[0] || null)} />
            {data.utilityBillFile ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-700 truncate">{data.utilityBillFile.name}</span>
              </div>
            ) : null}
            <button
              onClick={() => billRef.current?.click()}
              className="w-full py-6 flex flex-col items-center justify-center gap-3 bg-surface-container-low border-2 border-dashed border-outline-variant/40 rounded-2xl text-secondary hover:bg-secondary/5 hover:border-secondary transition-all"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                {data.utilityBillFile ? 'Changer le justificatif' : 'Ajouter votre document'}
              </span>
              <span className="text-xs text-on-surface-variant">Formats : PDF, JPG, PNG (Max 5MB)</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-error font-semibold text-center bg-error/5 border border-error/20 py-3 rounded-xl">{error}</p>
        )}

        <div className="flex flex-col gap-4 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full bg-secondary text-on-secondary py-4 rounded-xl font-semibold uppercase tracking-widest shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
          >
            Soumettre les documents
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </Layout>
  );
}
