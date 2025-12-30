
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../hooks/useLanguage';

const TechStep: React.FC<{ 
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

const HowItWorksPage: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="max-w-5xl mx-auto space-y-24 md:space-y-32 py-10 px-4">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <div className="inline-block p-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mb-4 shadow-lg shadow-orange-500/10">
                    <div className="bg-[#10101A] px-3 py-1 rounded-full">
                         <span className="text-[8px] font-black text-white uppercase tracking-widest">NextGen Prediction Protocol</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                    {t('howitworks_title')}
                </h1>
                <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
                    {t('howitworks_subtitle')}
                </p>
            </section>

            {/* Detailed Steps */}
            <section className="max-w-3xl mx-auto space-y-16 md:space-y-24">
                <TechStep 
                    number={1}
                    badge={t('howitworks_step1_badge')}
                    title={t('howitworks_step1_title')}
                    description={t('howitworks_step1_desc')}
                    icon="🛰️"
                />
                <TechStep 
                    number={2}
                    badge={t('howitworks_step2_badge')}
                    title={t('howitworks_step2_title')}
                    description={t('howitworks_step2_desc')}
                    icon="🧠"
                />
                <TechStep 
                    number={3}
                    badge={t('howitworks_step3_badge')}
                    title={t('howitworks_step3_title')}
                    description={t('howitworks_step3_desc')}
                    icon="📡"
                />
                <TechStep 
                    number={4}
                    badge={t('howitworks_step4_badge')}
                    title={t('howitworks_step4_title')}
                    description={t('howitworks_step4_desc')}
                    icon="📈"
                    isLast
                />
            </section>

            {/* Premium CTA Box */}
            <section className="container mx-auto max-w-4xl">
                <div className="relative p-0.5 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-[2rem] overflow-hidden shadow-2xl group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
                    <div className="bg-[#10101A] rounded-[1.95rem] py-16 px-8 md:py-20 md:px-12 text-center relative z-10 transition-transform group-hover:scale-[0.998] duration-500">
                        <div className="absolute -top-20 -left-20 w-48 h-48 bg-orange-500/5 blur-[80px] pointer-events-none"></div>
                        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/5 blur-[80px] pointer-events-none"></div>
                        
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
                            {t('howitworks_cta_title')}
                        </h2>
                        <p className="text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto font-medium leading-relaxed">
                            {t('howitworks_cta_subtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link to="/pricing" className="w-full sm:w-auto">
                                <Button className="w-full px-12 py-4 text-xl font-black shadow-xl shadow-orange-500/20 rounded-xl transform hover:scale-105 transition-all">
                                    {t('howitworks_cta_button')}
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-10 flex flex-wrap justify-center gap-6 opacity-30 text-[9px] font-black uppercase tracking-widest text-gray-500">
                            <span>NO HIDDEN FEES</span>
                            <span>•</span>
                            <span>INSTANT ACCESS</span>
                            <span>•</span>
                            <span>SECURE PAYMENT</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HowItWorksPage;
