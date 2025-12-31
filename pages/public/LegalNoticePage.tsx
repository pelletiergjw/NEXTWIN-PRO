
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const LegalNoticePage: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Compliance & Global Standards</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t('legal_notice_title')}</h1>
                <p className="text-gray-400 font-medium">Informations réglementaires et cadre contractuel de NextWin.</p>
            </div>

            <Card className="text-gray-300 space-y-12 p-8 md:p-12 border-gray-800 bg-[#1C1C2B] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* 1. Édition du site */}
                <section className="space-y-5">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        1. Édition du site
                    </h2>
                    <div className="pl-6 space-y-3 border-l border-gray-800 ml-0.5">
                        <p className="text-white font-bold text-lg">NEXTWIN Digital Technologies LLC</p>
                        <p className="text-sm leading-relaxed">
                            Société technologique de droit émirati spécialisée dans l'ingénierie algorithmique et l'analyse de données sportives.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm mt-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-gray-500 uppercase text-[10px] font-black block mb-1">Siège social</span>
                                <p className="text-white font-medium">Innovation Tower, Tech District<br />Sheikh Zayed Road, Dubai<br />United Arab Emirates</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <span className="text-gray-500 uppercase text-[10px] font-black block mb-1">Contact Support</span>
                                <p className="text-white font-medium">support@nextwin.ai</p>
                                <p className="text-gray-500 text-xs mt-1">Réponse sous 24h ouvrées</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Nature des Services */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        2. Nature des Services
                    </h2>
                    <p className="text-sm leading-relaxed pl-6 text-gray-400">
                        NextWin est une solution logicielle fournissant des analyses prédictives basées sur des modèles d'Intelligence Artificielle. 
                        <strong> NextWin n'est en aucun cas un site de paris sportifs, un bookmaker ou un intermédiaire de jeu.</strong> 
                        Notre service est strictement consultatif et informatif. Les utilisateurs doivent se conformer à la législation en vigueur dans leur pays de résidence concernant les jeux d'argent.
                    </p>
                </section>

                {/* 3. Propriété Intellectuelle */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        3. Propriété Intellectuelle
                    </h2>
                    <p className="text-sm leading-relaxed pl-6">
                        L'ensemble de la structure, des codes sources, des algorithmes propriétaires, des logos et des visuels générés par l'IA NextWin est la propriété intellectuelle exclusive de <strong>NEXTWIN Digital Technologies LLC</strong>. Toute extraction de données ("scraping"), reproduction ou exploitation commerciale sans accord écrit préalable constitue une violation des droits d'auteur internationaux.
                    </p>
                </section>

                {/* 4. Limitation de Responsabilité & Jeu Responsable */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        4. Jeu Responsable
                    </h2>
                    <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl ml-6">
                        <p className="text-sm leading-relaxed font-medium">
                            Les analyses fournies sont le résultat de probabilités mathématiques et ne sauraient constituer une garantie de gain. Le sport reste imprévisible. 
                            <span className="block mt-4 text-orange-400 font-bold uppercase tracking-widest text-[11px]">Avertissement Risque :</span>
                            Le jeu comporte des risques d'endettement et de dépendance. NEXTWIN Digital Technologies LLC décline toute responsabilité en cas de perte financière subie par l'utilisateur lors de ses activités de paris sur des plateformes tierces.
                        </p>
                    </div>
                </section>

                {/* 5. Hébergement & Données */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        5. Hébergement
                    </h2>
                    <p className="text-sm leading-relaxed pl-6 text-gray-400">
                        L'infrastructure technologique de NextWin est hébergée sur les serveurs sécurisés de <strong>Google Cloud Platform (GCP)</strong>, garantissant une protection des données optimale et une conformité aux protocoles de sécurité internationaux.
                    </p>
                </section>

                <div className="pt-10 text-center opacity-30 text-[10px] font-black uppercase tracking-widest text-gray-600 border-t border-gray-800">
                    NextWin Global Compliance • 2025 • NEXTWIN Digital Technologies LLC
                </div>
            </Card>
        </div>
    );
};

export default LegalNoticePage;
