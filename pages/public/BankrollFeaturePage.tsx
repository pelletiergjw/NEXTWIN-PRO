
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../hooks/useLanguage';

const PillarStep: React.FC<{ 
    number: number; 
    badge: string; 
    title: string; 
    description: string; 
    icon: string;
    isLast?: boolean;
}> = ({ number, badge, title, description, icon, isLast }) => (
    <div className="relative group">
        {!isLast && (
            <div className="absolute left-7 top-14 bottom-0 w-px bg-gradient-to-b from-orange-500/40 to-transparent hidden md:block"></div>
        )}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start relative z-10">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#1C1C2B] border border-gray-800/60 flex items-center justify-center text-2xl shadow-xl group-hover:border-orange-500/40 transition-all duration-500 group-hover:scale-110">
                {icon}
            </div>
            <div className="space-y-3">
                <span className="inline-block px-2.5 py-0.5 bg-orange-500/10 text-orange-400 text-[8px] font-black tracking-widest uppercase rounded-full border border-orange-500/20">
                    {badge}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">{title}</h3>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-2xl font-medium opacity-90">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

const BankrollFeaturePage: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="max-w-5xl mx-auto space-y-24 md:space-y-32 py-10 px-4">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <div className="inline-block p-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4 shadow-lg shadow-orange-500/10">
                    <div className="bg-[#10101A] px-4 py-1 rounded-full">
                         <span className="text-[9px] font-black text-white uppercase tracking-widest">Scientific Capital Management</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {t('bankroll_feature_title')}
                </h1>
                <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                    {t('bankroll_feature_subtitle')}
                </p>
            </section>

            {/* The 4 Pillars of Bankroll Protocol */}
            <section className="max-w-3xl mx-auto space-y-16 md:space-y-24">
                <PillarStep 
                    number={1}
                    badge="PILIER 1 : INITIALISATION"
                    title={t('bankroll_feature1_title')}
                    description={t('bankroll_feature1_desc')}
                    icon="🏦"
                />
                <PillarStep 
                    number={2}
                    badge="PILIER 2 : ANALYSE DES PERFORMANCES"
                    title={t('bankroll_feature2_title')}
                    description={t('bankroll_feature2_desc')}
                    icon="📊"
                />
                <PillarStep 
                    number={3}
                    badge="PILIER 3 : CALCULATEUR D'EXPOSITION"
                    title={t('bankroll_feature3_title')}
                    description={t('bankroll_feature3_desc')}
                    icon="🧠"
                />
                <PillarStep 
                    number={4}
                    badge="PILIER 4 : HISTORIQUE CERTIFIÉ"
                    title={t('bankroll_feature4_title')}
                    description={t('bankroll_feature4_desc')}
                    icon="🎯"
                    isLast
                />
            </section>

            {/* Tool Explanation Card */}
            <section className="container mx-auto max-w-5xl">
                <div className="bg-[#1C1C2B] border border-gray-800/40 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                Pourquoi NextWin a créé <span className="text-orange-500">cet outil ?</span>
                            </h2>
                            <p className="text-base md:text-lg text-gray-400 leading-relaxed font-medium">
                                Dans le sport, la prédiction n'est que la moitié du chemin. La gestion du risque est ce qui sépare les amateurs des experts. Notre interface de gestion élimine l'approximation.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-gray-900/40 p-5 rounded-2xl border border-gray-800/60">
                                    <span className="text-2xl">⚡</span>
                                    <div>
                                        <p className="text-white font-bold">Zéro Calcul Manuel</p>
                                        <p className="text-sm text-gray-500 font-medium">ROI, Yield et Taux de réussite calculés en temps réel.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-900/40 p-5 rounded-2xl border border-gray-800/60">
                                    <span className="text-2xl">📈</span>
                                    <div>
                                        <p className="text-white font-bold">Vision Long Terme</p>
                                        <p className="text-sm text-gray-500 font-medium">Graphiques d'évolution pour visualiser votre progression.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#10101A] to-black rounded-[2rem] p-8 border border-gray-800 shadow-2xl relative">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Dashboard Preview</span>
                                    <span className="text-green-400 font-black text-xs">+12.5% Yield</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">ROI</p>
                                        <p className="text-xl font-black text-white">+15.2%</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Winrate</p>
                                        <p className="text-xl font-black text-white">68%</p>
                                    </div>
                                </div>
                                <div className="h-32 flex items-end gap-2 px-2">
                                    <div className="flex-1 bg-orange-500/20 rounded-t-lg h-[40%]"></div>
                                    <div className="flex-1 bg-orange-500/40 rounded-t-lg h-[60%]"></div>
                                    <div className="flex-1 bg-orange-500/60 rounded-t-lg h-[45%]"></div>
                                    <div className="flex-1 bg-orange-500/80 rounded-t-lg h-[75%]"></div>
                                    <div className="flex-1 bg-orange-500 rounded-t-lg h-[90%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="container mx-auto max-w-4xl">
                <div className="relative p-0.5 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-[2rem] overflow-hidden shadow-2xl group">
                    <div className="bg-[#10101A] rounded-[1.95rem] py-16 px-8 md:py-20 md:px-12 text-center relative z-10 transition-transform group-hover:scale-[0.998] duration-500">
                        <div className="absolute -top-20 -left-20 w-48 h-48 bg-orange-500/5 blur-[80px] pointer-events-none"></div>
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/5 blur-[80px] pointer-events-none"></div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            {t('bankroll_feature_cta_title')}
                        </h2>
                        <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                            {t('bankroll_feature_cta_desc')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link to="/pricing" className="w-full sm:w-auto">
                                <Button className="w-full px-12 py-4 text-xl font-black shadow-xl shadow-orange-500/20 rounded-xl transform hover:scale-105 transition-all">
                                    {t('bankroll_feature_cta_button')}
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-center gap-6 opacity-30 text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <span>TOTAL PRIVACY</span>
                            <span>•</span>
                            <span>DATA ENCRYPTION</span>
                            <span>•</span>
                            <span>PRO TOOLS</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BankrollFeaturePage;
