
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { SPORTS } from '../../constants';
import { useLanguage } from '../../hooks/useLanguage';
import BookmakerLogos from '../../components/BookmakerLogos';
import Testimonials from '../../components/Testimonials';
import HeroCarousel from '../../components/HeroCarousel';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('football');

  return (
    <div className="space-y-20 md:space-y-32">
      {/* Hero Section */}
      <section className="relative pt-10 md:pt-16 pb-12 text-center overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">NextWin AI Engine v4.0 Active</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
            {t('home_hero_title_main')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
              {t('home_hero_title_accent')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            {t('home_hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full px-12 py-4 text-base font-bold rounded-xl shadow-2xl shadow-orange-500/20 hover:scale-105 transition-transform">
                {t('home_hero_cta_primary')}
              </Button>
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto">
              <button className="w-full px-12 py-4 text-base font-bold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all backdrop-blur-xl">
                {t('home_hero_cta_secondary')}
              </button>
            </Link>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <HeroCarousel />
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none opacity-30"></div>
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Features Grid (Replaces StatBoxes based on design image) */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            title={t('home_feature_ia_title')} 
            description={t('home_feature_ia_desc')}
            icon={<BrainIcon />}
          />
          <FeatureCard 
            title={t('home_feature_realtime_title')} 
            description={t('home_feature_realtime_desc')}
            icon={<FlashIcon />}
          />
          <FeatureCard 
            title={t('home_feature_responsible_title')} 
            description={t('home_feature_responsible_desc')}
            icon={<ShieldIcon />}
          />
        </div>
      </section>

      {/* Sports Detail Tabs */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="bg-[#1C1C2B] border border-gray-800/40 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="text-center mb-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{t('home_tabs_title')}</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-base">{t('home_tabs_subtitle')}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-14 relative z-10">
                {SPORTS.map(sport => (
                    <button 
                        key={sport.key}
                        onClick={() => setActiveTab(sport.key)}
                        className={`px-8 py-3 rounded-2xl font-bold text-[12px] uppercase tracking-[0.2em] transition-all duration-300 border ${activeTab === sport.key ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105' : 'bg-gray-900/50 text-gray-500 hover:text-white border-gray-800'}`}
                    >
                        {sport.icon} {t(sport.labelKey)}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start relative z-10">
                <div className="space-y-8 animate-fadeIn">
                    <div className="inline-block px-4 py-1.5 bg-orange-500/10 text-orange-400 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full border border-orange-500/20">
                        Module Analyseur {activeTab}
                    </div>
                    <h3 className="text-3xl font-bold text-white leading-tight">
                        Expertise {activeTab === 'football' ? 'Football' : activeTab === 'basketball' ? 'Basketball' : 'Tennis'}
                    </h3>
                    <p className="text-base text-gray-400 leading-relaxed font-medium">
                        {activeTab === 'football' ? t('home_tab_foot_desc') : activeTab === 'basketball' ? t('home_tab_basket_desc') : t('home_tab_tennis_desc')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SPORTS.find(s => s.key === activeTab)?.betTypes.map(bt => (
                            <div key={bt.key} className="flex items-center gap-3 bg-gray-900/40 p-4 rounded-xl border border-gray-800/60 group hover:border-orange-500/20 transition-all">
                                <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-[10px] font-bold">✓</span>
                                <span className="text-white font-bold text-sm tracking-wide">{t(bt.labelKey)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-8 border border-gray-800 shadow-2xl flex items-center justify-center aspect-square relative group sticky top-28">
                    <div className="text-[8rem] group-hover:scale-105 transition-transform duration-700">{SPORTS.find(s => s.key === activeTab)?.icon}</div>
                    <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl rounded-full"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Comparison: Human vs AI */}
      <section className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">{t('home_vs_title')}</h2>
            <div className="h-1.5 w-16 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-gray-800/20 rounded-[2.5rem] overflow-hidden border border-gray-800/40 shadow-2xl">
            {/* Human Column */}
            <div className="bg-[#1C1C2B] p-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-3xl mb-8">🧔</div>
                <h3 className="text-[12px] font-bold text-gray-500 mb-10 uppercase tracking-[0.3em]">{t('home_vs_human')}</h3>
                <ul className="space-y-6 w-full">
                    {[t('home_vs_item1'), t('home_vs_item2'), t('home_vs_item3')].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-4 text-gray-500 font-bold text-sm">
                            <span className="text-red-500 text-lg">✕</span>
                            <span className="line-through decoration-red-500/20">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* AI Column */}
            <div className="bg-gradient-to-br from-[#1C1C2B] to-[#11111E] p-12 flex flex-col items-center text-center relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/5 blur-[80px]"></div>
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-2xl shadow-orange-500/20">🤖</div>
                <h3 className="text-[12px] font-bold text-white mb-10 uppercase tracking-[0.3em]">{t('home_vs_ia')}</h3>
                <ul className="space-y-6 w-full">
                    {[t('home_vs_ia_item1'), t('home_vs_ia_item2'), t('home_vs_ia_item3')].map((item, i) => (
                        <li key={i} className="flex items-center justify-center gap-4 text-green-400 font-bold text-base">
                            <span className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-[10px]">✓</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      <Testimonials />
      <BookmakerLogos />

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-24 max-w-4xl">
        <div className="relative p-1 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-[2.5rem] overflow-hidden shadow-2xl group">
            <div className="bg-[#10101A] rounded-[2.4rem] py-20 px-8 md:py-24 md:px-16 text-center relative z-10 transition-transform group-hover:scale-[0.998] duration-500">
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-orange-500/5 blur-[120px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/5 blur-[120px] pointer-events-none"></div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-[1.2]">
                  Rejoignez <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">la communauté</span>
                </h2>
                <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                  Ne pariez plus avec vos émotions. Laissez notre intelligence artificielle transformer la data brute en opportunités de gains réelles.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <Link to="/pricing" className="w-full sm:w-auto">
                      <Button className="w-full px-12 py-4.5 text-lg font-bold shadow-2xl shadow-orange-500/20 rounded-2xl transform hover:scale-105 transition-all">
                        {t('howitworks_cta_button')}
                      </Button>
                  </Link>
                </div>
                <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-40 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">
                   <span>SSL SECURE</span>
                   <span>•</span>
                   <span>PAIEMENT GARANTI</span>
                   <span>•</span>
                   <span>NO BOTS</span>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

// --- SUB-COMPONENTS FOR NEW DESIGN ---

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <Card className="relative bg-[#1C1C2B] border-gray-800/40 p-8 rounded-[1.2rem] shadow-xl overflow-hidden group">
    {/* Grid Background Effect */}
    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
    
    <div className="relative z-10 flex flex-col gap-6">
      <div className="w-12 h-12 bg-gray-900/80 border border-gray-800 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  </Card>
);

const BrainIcon = () => (
  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const FlashIcon = () => (
  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default HomePage;
