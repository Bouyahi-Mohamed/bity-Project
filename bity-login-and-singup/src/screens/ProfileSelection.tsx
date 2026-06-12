import { GraduationCap, Landmark, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useSignup } from '../context/SignupContext';

export default function ProfileSelection() {
  const navigate = useNavigate();
  const { setField } = useSignup();

  const choose = (role: 'student' | 'owner', path: string) => {
    setField('role', role);
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface py-12 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-4xl flex flex-col items-center relative z-10">
        <header className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold text-secondary mb-4">bity</h1>
          <h2 className="text-3xl font-display font-semibold text-on-surface mb-2">Choisissez votre profil</h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto">
            Sélectionnez la manière dont vous souhaitez utiliser la plateforme pour une expérience sur mesure.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => choose('student', '/verify-student')}
            className="group relative flex flex-col items-start p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 premium-shadow hover:border-secondary/30 transition-all text-left cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300 shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-display font-semibold text-on-surface mb-2 group-hover:text-secondary transition-colors">
                Je suis un étudiant
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Recherche de logements vérifiés et abordables. Accédez à des annonces exclusives, certifiées, idéales pour votre budget.
              </p>
            </div>
            <div className="mt-8 flex items-center text-secondary font-semibold uppercase tracking-widest text-xs opacity-60 group-hover:opacity-100 transition-opacity">
              Continuer
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => choose('owner', '/verify-landlord')}
            className="group relative flex flex-col items-start p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 premium-shadow hover:border-secondary/30 transition-all text-left cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300 shadow-sm">
              <Landmark className="w-8 h-8" />
            </div>
            <div className="flex-grow">
              <h3 className="text-2xl font-display font-semibold text-on-surface mb-2 group-hover:text-secondary transition-colors">
                Je suis un propriétaire
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Proposez des logements certifiés avec des garanties locatives solides. Louez en toute sérénité à des étudiants vérifiés.
              </p>
            </div>
            <div className="mt-8 flex items-center text-secondary font-semibold uppercase tracking-widest text-xs opacity-60 group-hover:opacity-100 transition-opacity">
              Continuer
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </div>

        <div className="mt-12">
          <Link to="/" className="text-outline hover:text-secondary transition-colors uppercase tracking-widest text-xs font-semibold flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
