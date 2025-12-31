
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const LegalNoticePage: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block px-4 py-1 bg-gray-800 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Compliance & Legal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t('legal_notice_title')}</h1>
            </div>

            <Card className="text-gray-300 space-y-10 p-8 md:p-12 border-gray-800 bg-[#1C1C2B] rounded-[2.5rem] shadow-2xl">
                {/* 1. Édition du site */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        1. Éditeur du site
                    </h2>
                    <div className="pl-5 space-y-2 border-l border-gray-800 ml-0.5">
                        <p className="font-bold text-white">PREMIUM BETTING TECHNOLOGIES OÜ</p>
                        <p className="text-sm">Société à responsabilité limitée de droit estonien</p>
                        <p className="text-sm"><span className="text-gray-500 uppercase text-[10px] font-bold mr-2">Siège social :</span> Harju maakond, Tallinn, Lasnamäe linnaosa, Katusepapi tn 6-410, 11412, Estonie</p>
                        <p className="text-sm"><span className="text-gray-500 uppercase text-[10px] font-bold mr-2">Numéro d’enregistrement :</span> 12991177</p>
                        <p className="text-sm"><span className="text-gray-500 uppercase text-[10px] font-bold mr-2">Email :</span> support@nextwin.ai</p>
                    </div>
                </section>

                {/* 2. Activité */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        2. Objet du service
                    </h2>
                    <p className="text-sm leading-relaxed pl-5">
                        Le site NextWin est une plateforme technologique fournissant des outils d'analyse statistique et d'aide à la décision basés sur l'intelligence artificielle pour les marchés sportifs. NextWin n'est pas un bookmaker et ne collecte aucune mise d'argent. Les services proposés sont purement informatifs et consultatifs.
                    </p>
                </section>

                {/* 3. Propriété intellectuelle */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        3. Propriété intellectuelle
                    </h2>
                    <p className="text-sm leading-relaxed pl-5">
                        L'ensemble des contenus présents sur le site (logos, algorithmes, textes, graphismes, logiciels, bases de données) est la propriété exclusive de PREMIUM BETTING TECHNOLOGIES OÜ. Toute reproduction, distribution ou modification, même partielle, sans autorisation écrite préalable est strictement interdite et peut faire l'objet de poursuites judiciaires conformément aux lois internationales sur le droit d'auteur.
                    </p>
                </section>

                {/* 4. Limitation de responsabilité */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        4. Responsabilité
                    </h2>
                    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl ml-5">
                        <p className="text-sm leading-relaxed text-red-200/80">
                            Le jeu comporte des risques : endettement, isolement, dépendance. L'éditeur ne pourra en aucun cas être tenu responsable des pertes financières, directes ou indirectes, subies par l'utilisateur à la suite de l'utilisation des analyses fournies. Les résultats passés ne garantissent pas les résultats futurs. L'utilisateur demeure seul responsable de la gestion de son capital.
                        </p>
                    </div>
                </section>

                {/* 5. Hébergement */}
                <section className="space-y-4">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                        5. Hébergement
                    </h2>
                    <p className="text-sm leading-relaxed pl-5 text-gray-400 font-medium">
                        Le site est hébergé par Google Cloud Platform (GCP), dont les serveurs sont situés dans l'Union Européenne (Belgique / France), assurant un niveau de sécurité et de conformité conforme au RGPD.
                    </p>
                </section>

                <div className="pt-10 text-center opacity-30 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Dernière mise à jour : Mars 2025 • PREMIUM BETTING TECHNOLOGIES OÜ
                </div>
            </Card>
        </div>
    );
};

export default LegalNoticePage;
