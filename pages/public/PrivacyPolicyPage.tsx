
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Data Protection & GDPR</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t('privacy_title')}</h1>
        <p className="text-gray-400 font-medium">Engagement de NextWin sur la protection de votre vie privée et de vos données personnelles.</p>
      </div>

      <Card className="text-gray-300 space-y-12 p-8 md:p-12 border-gray-800 bg-[#1C1C2B] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed">
          
          {/* Section 1: Introduction */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              1. Introduction et Responsable du Traitement
            </h2>
            <p>
              La présente Politique de Confidentialité décrit la manière dont <strong>NEXTWIN Digital Technologies LLC</strong> (« nous », « notre »), située à Innovation Tower, Tech District, Dubai, UAE, collecte, utilise et protège vos données à caractère personnel lorsque vous utilisez nos services via nextwin.ai.
            </p>
            <p>
              Nous accordons une importance fondamentale à la protection de votre vie privée et nous nous engageons à traiter vos données dans le respect des meilleures pratiques internationales et des législations applicables en matière de protection des données.
            </p>
          </section>

          {/* Section 2: Données Collectées */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              2. Nature des données collectées
            </h2>
            <p>Dans le cadre de votre utilisation du site, nous pouvons collecter les catégories de données suivantes :</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong>Données d'identification :</strong> Nom d'utilisateur, adresse e-mail.</li>
              <li><strong>Données de transaction :</strong> Historique des abonnements, informations de facturation (gérées de manière sécurisée par notre prestataire Stripe).</li>
              <li><strong>Données d'utilisation :</strong> Préférences sportives, historique des analyses demandées, données de navigation via les cookies.</li>
              <li><strong>Données de support :</strong> Contenu de vos messages envoyés via notre formulaire de contact ou e-mail.</li>
            </ul>
          </section>

          {/* Section 3: Finalités du Traitement */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              3. Pourquoi utilisons-nous vos données ?
            </h2>
            <p>Le traitement de vos données est nécessaire pour les finalités suivantes :</p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-blue-400 font-bold text-xs uppercase block mb-1">Exécution du contrat</span>
                <p className="text-xs text-gray-500">Gestion de votre abonnement Premium Pro et accès aux outils d'analyse IA.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-blue-400 font-bold text-xs uppercase block mb-1">Amélioration continue</span>
                <p className="text-xs text-gray-500">Optimisation de nos algorithmes et personnalisation de l'interface utilisateur.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-blue-400 font-bold text-xs uppercase block mb-1">Sécurité</span>
                <p className="text-xs text-gray-500">Prévention de la fraude, détection des accès non autorisés et protection du site.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-blue-400 font-bold text-xs uppercase block mb-1">Communication</span>
                <p className="text-xs text-gray-500">Envoi des 9 pronostics quotidiens et assistance technique personnalisée.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Conservation des Données */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              4. Durée de conservation
            </h2>
            <p>
              Nous conservons vos données uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li><strong>Compte utilisateur :</strong> Jusqu'à la suppression du compte par l'Utilisateur ou après 3 ans d'inactivité.</li>
              <li><strong>Données de facturation :</strong> Conservées pendant 10 ans conformément aux obligations comptables et fiscales.</li>
              <li><strong>Cookies :</strong> La durée de validité de nos cookies est de 13 mois maximum.</li>
            </ul>
          </section>

          {/* Section 5: Partage des Données */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              5. Destinataires et Transferts
            </h2>
            <p>
              <strong>Vos données ne sont jamais vendues à des tiers.</strong> Elles sont uniquement partagées avec nos prestataires techniques de confiance pour le fonctionnement du service :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400 font-medium">
              <li><strong>Google Cloud :</strong> Pour l'hébergement sécurisé des données en UE.</li>
              <li><strong>Stripe :</strong> Pour le traitement hautement sécurisé des paiements.</li>
              <li><strong>SendGrid/E-mail Services :</strong> Pour l'envoi de vos analyses quotidiennes.</li>
            </ul>
          </section>

          {/* Section 6: Vos Droits */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              6. Vos Droits
            </h2>
            <p>Conformément aux principes du RGPD, vous disposez des droits suivants :</p>
            <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl italic space-y-2 text-gray-300">
              <p>• Droit d'<strong>accès</strong> et de <strong>rectification</strong> de vos données.</p>
              <p>• Droit à l'<strong>effacement</strong> (« droit à l'oubli »).</p>
              <p>• Droit à la <strong>portabilité</strong> de vos données.</p>
              <p>• Droit d'<strong>opposition</strong> ou de limitation du traitement.</p>
            </div>
            <p className="text-sm">
              Pour exercer ces droits, vous pouvez nous contacter à tout moment à : <span className="text-white font-bold">support@nextwin.ai</span>.
            </p>
          </section>

          {/* Section 7: Sécurité */}
          <section className="space-y-4">
            <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              7. Sécurité des données
            </h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles rigoureuses (chiffrement TLS, protocoles d'accès restreint) pour assurer la sécurité de vos données et prévenir toute perte, altération ou accès non autorisé.
            </p>
          </section>

        </div>

        <div className="pt-10 text-center opacity-30 text-[10px] font-black uppercase tracking-widest text-gray-600 border-t border-gray-800">
          NextWin Privacy Assurance • 2025 • NEXTWIN Digital Technologies LLC
        </div>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
