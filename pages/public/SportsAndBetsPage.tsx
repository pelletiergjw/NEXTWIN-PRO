
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SPORTS } from '../../constants';
import { useLanguage } from '../../hooks/useLanguage';

const SportSection: React.FC<{ 
    sport: typeof SPORTS[0], 
    index: number 
}> = ({ sport, index }) => {
    const { t } = useLanguage();
    const isEven = index % 2 === 0;

    return (
        <section className={`py-12 md:py-20 ${isEven ? 'bg-transparent' : 'bg-white/5 border-y border-white/5'}`}>
            <div className="container mx-auto px-4">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                    
                    {/* Visual Pillar */}
                    <div className="w-full lg:w-1/3 flex justify-center">
                        <div className="relative group">
                            <div className="absolute -inset-10 bg-gradient-to-tr from-orange-500/10 to-pink-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-gradient-to-br from-[#1C1C2B] to-black border border-white/10 flex items-center justify-center text-7xl md:text-8xl shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                {sport.icon}
                                <div className="absolute -bottom-4 -right-4 px-4 py-1.5 bg-orange-500 rounded-full shadow-xl shadow-orange-500/20">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{t('sports_status_optimized')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Pillar */}
                    <div className="w-full lg:w-2/3 space-y-8">
                        <div>
                            <span className="text-[11px] font-black text-orange-400 uppercase tracking-[0.3em] mb-4 block">Écosystème {t(sport.labelKey)}</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">{t(sport.labelKey)}</h2>
                            <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-2xl">
                                {sport.key === 'football' ? t('home_tab_foot_desc') : sport.key === 'basketball' ? t('home_tab_basket_desc') : t('home_tab_tennis_desc')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">{t('sports_coverage_title')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {sport.betTypes.map((bt) => (
                                    <div key={bt.key} className="flex items-center gap-3 bg-[#1C1C2B]/60 p-4 rounded-xl border border-white/5 hover:border-orange-500/30 transition-all group">
                                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center text-[10px] text-green-400 font-bold border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-colors">✓</div>
                                        <span className="text-white font-bold text-sm tracking-wide">{t(bt.labelKey)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SportsAndBetsPage: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="pb-24">
            {/* Page Header */}
            <div className="container mx-auto px-4 pt-16 pb-20 text-center">
                <div className="inline-block px-4 py-1.5 mb-8 bg-orange-500/10 border border-orange-500/20 rounded-full">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400">Modèles Prédictifs Couverts</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight leading-tight">
                    {t('sports_page_title')}
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                    {t('sports_page_subtitle')}
                </p>
            </div>

            {/* Sport Blocks */}
            <div className="space-y-0">
                {SPORTS.map((sport, index) => (
                    <SportSection key={sport.key} sport={sport} index={index} />
                ))}
            </div>

            {/* Final Call to Action */}
            <div className="container mx-auto px-4 mt-20">
                <div className="relative p-1 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-[3rem] overflow-hidden shadow-2xl group max-w-5xl mx-auto">
                    <div className="bg-[#10101A] rounded-[2.9rem] py-16 px-8 md:py-20 md:px-12 text-center relative z-10 transition-transform duration-500">
                        <div className="absolute -top-32 -left-32 w-80 h-80 bg-orange-500/5 blur-[120px] pointer-events-none"></div>
                        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/5 blur-[120px] pointer-events-none"></div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            {t('sports_cta_title')}
                        </h2>
                        <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                            {t('sports_cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link to="/analysis" className="w-full sm:w-auto">
                                <Button className="w-full px-12 py-4.5 text-lg font-black shadow-2xl shadow-orange-500/20 rounded-2xl transform hover:scale-105 transition-all uppercase tracking-widest">
                                    {t('sports_cta_button')}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SportsAndBetsPage;
