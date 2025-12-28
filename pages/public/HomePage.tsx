
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { SPORTS } from '../../constants';
import HeroImage from '../../components/HeroImage';
import { useLanguage } from '../../hooks/useLanguage';
import BookmakerLogos from '../../components/BookmakerLogos';
import Testimonials from '../../components/Testimonials';
import Logo from '../../components/Logo';

const FeatureCard: React.FC<{ icon: string; title: string; description: string; highlight?: boolean }> = ({ icon, title, description, highlight }) => (
  <Card className={`text-center transform hover:scale-105 transition-all duration-300 ${highlight ? 'border-orange-500 ring-1 ring-orange-500/20' : ''}`}>
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className={`text-xl font-bold mb-2 ${highlight ? 'text-orange-400' : 'text-white'}`}>{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </Card>
);

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden flex flex-col items-center">
        <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
          <div className="max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
              {t('home_hero_title_1')}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 block mt-2">
                {t('home_hero_title_2')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-xl mx-auto leading-relaxed font-light">
              {t('home_hero_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button className="px-10 py-4 text-lg w-full sm:w-auto shadow-[0_20px_50px_rgba(249,115,22,0.3)] hover:scale-105 transition-transform">
                  {t('home_hero_cta')}
                </Button>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto">
                <Button variant="ghost" className="px-10 py-4 text-lg w-full sm:w-auto border border-gray-800 bg-white/5 backdrop-blur-sm hover:bg-white/10">
                  {t('see_pricing')}
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full max-w-5xl mt-4">
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('home_features_title')}</h2>
          <div className="h-1.5 w-20 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🏆" 
            title={t('home_feature1_title')}
            description={t('home_feature1_desc')}
            highlight
          />
          <FeatureCard 
            icon="🔍" 
            title={t('home_feature2_title')}
            description={t('home_feature2_desc')}
          />
          <FeatureCard 
            icon="📈" 
            title={t('home_feature3_title')}
            description={t('home_feature3_desc')}
          />
        </div>
      </section>

      {/* Sports Section */}
      <section className="text-center bg-gradient-to-b from-gray-900/40 to-transparent py-24 rounded-[3rem] border border-gray-800/50 mx-4">
        <h2 className="text-3xl font-bold text-white mb-16">{t('home_sports_title')}</h2>
        <div className="flex justify-center items-center gap-12 flex-wrap px-4">
          {SPORTS.map(sport => (
            <div key={sport.key} className="group flex flex-col items-center p-8 bg-[#1C1C2B] rounded-3xl border border-gray-800 hover:border-orange-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl w-64">
              <span className="text-6xl mb-6 transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-500 cursor-default">{sport.icon}</span>
              <span className="text-xl font-black text-white">{t(sport.labelKey as any)}</span>
              <div className="mt-4 px-4 py-1 bg-orange-500/10 rounded-full">
                <span className="text-[10px] text-orange-400 uppercase font-black tracking-widest">3 pronos/jour</span>
              </div>
            </div>
          ))}
        </div>
         <div className="mt-16">
          <Link to="/sports-and-bets">
            <Button variant="secondary" className="px-10 py-3 text-base border border-gray-700">{t('home_sports_cta')}</Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Bookmakers Section */}
      <BookmakerLogos />

       {/* CTA Section - NEW PREMIUM DESIGN */}
      <section className="px-4 pb-32 pt-16">
        <div className="max-w-5xl mx-auto relative group">
          {/* Cadre de couleur (Dégradé animé) */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 via-pink-600 to-purple-600 rounded-[3rem] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          
          <div className="relative bg-[#10101A] border border-white/10 rounded-[2.8rem] overflow-hidden">
            {/* L'Onglet Noir Premium */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <div className="bg-black border-x border-b border-white/20 px-10 py-2 rounded-b-2xl shadow-2xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Accès Prioritaire Immédiat</span>
                </div>
            </div>

            <div className="px-6 py-24 md:py-32 text-center flex flex-col items-center relative">
              {/* Background Glow interne */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-orange-500/5 to-purple-500/5 pointer-events-none"></div>

              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter">
                  {t('home_cta_title')}
                </h2>
                <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                  {t('home_cta_subtitle')}
                </p>
                <div className="flex flex-col items-center gap-4">
                  <Link to="/pricing">
                      <Button className="bg-white hover:bg-gray-100 text-gray-900 text-xl px-16 py-6 shadow-[0_20px_60px_-15px_rgba(255,255,255,0.3)] font-black rounded-2xl transform hover:scale-105 transition-all duration-300">
                        {t('home_cta_button')}
                      </Button>
                  </Link>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mt-4 opacity-50">
                    🔒 Paiement sécurisé • Sans engagement
                  </p>
                </div>
              </div>
            </div>
            
            {/* Décorations géométriques subtiles */}
            <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-orange-600/10 rounded-full blur-[80px]"></div>
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-600/10 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
