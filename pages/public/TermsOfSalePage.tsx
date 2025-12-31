
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const TermsOfSalePage: React.FC = () => {
    const { t } = useLanguage();
    
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="text-center mb-16 space-y-4">
                <div className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Contractual Framework</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{t('tos_title')}</h1>
                <p className="text-gray-400 font-medium">Conditions d'accès et d'utilisation des services Premium NextWin.</p>
            </div>

            <Card className="text-gray-300 space-y-12 p-8 md:p-12 border-gray-800 bg-[#1C1C2B] rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="prose prose-invert max-w-none space-y-10 text-sm leading-relaxed">
                    
                    {/* Introduction */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                            Préambule
                        </h2>
                        <p>
                            Les présentes Conditions Générales de Vente (ci-après "CGV") sont conclues entre la société <strong>NEXTWIN Digital Technologies LLC</strong> (ci-après "l'Éditeur") et toute personne physique ou morale (ci-après "l'Utilisateur") souhaitant accéder aux services payants proposés sur le site nextwin.ai.
                        </p>
                    </section>

                    {/* Article 1 : Objet */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 1 : Objet des services</h3>
                        <p>
                            NextWin est une plateforme technologique fournissant des outils d'analyse statistique basés sur l'Intelligence Artificielle. Les services comprennent l'accès à des pronostics quotidiens, un analyseur de matchs et un gestionnaire de bankroll. 
                            <strong> Il est rappelé que NextWin n'est pas un bookmaker et ne garantit en aucun cas des gains financiers.</strong>
                        </p>
                    </section>

                    {/* Article 2 : Souscription et Accès */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 2 : Modalités de souscription</h3>
                        <p>
                            L'accès aux services "Premium Pro" est conditionné par la création d'un compte utilisateur et le paiement d'un abonnement mensuel. L'Utilisateur garantit l'exactitude des informations fournies lors de son inscription. L'accès est personnel et non transmissible.
                        </p>
                    </section>

                    {/* Article 3 : Tarification et Paiement */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 3 : Conditions financières</h3>
                        <p>
                            Le tarif de l'abonnement est de <strong>12,99€ TTC par mois</strong>. Le paiement s'effectue par carte bancaire via le prestataire sécurisé <strong>Stripe</strong>. Le débit est effectué à la date d'anniversaire mensuelle de la souscription. L'Éditeur se réserve le droit de modifier ses tarifs, sous réserve d'en informer l'Utilisateur 30 jours avant l'application du nouveau tarif.
                        </p>
                    </section>

                    {/* Article 4 : Absence de Droit de Rétractation */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 4 : Droit de rétractation</h3>
                        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl italic">
                            Conformément aux dispositions légales relatives aux contenus numériques fournis sur support immatériel et dont l'exécution a commencé après accord préalable exprès du consommateur, l'Utilisateur reconnaît qu'il <strong>renonce expressément à son droit de rétractation</strong> dès l'accès aux services Premium.
                        </div>
                    </section>

                    {/* Article 5 : Résiliation */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 5 : Durée et Résiliation</h3>
                        <p>
                            L'abonnement est conclu pour une durée indéterminée avec une période minimale d'un mois. 
                            <strong> La résiliation peut être effectuée à tout moment par l'Utilisateur</strong> directement depuis son espace membre. La résiliation prend effet à la fin de la période de facturation en cours. Aucun remboursement partiel ne sera effectué.
                        </p>
                    </section>

                    {/* Article 6 : Limitation de Responsabilité */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 6 : Responsabilité et Garanties</h3>
                        <p>
                            L'Éditeur s'engage à mettre en œuvre les moyens techniques nécessaires pour assurer la continuité du service. Toutefois, NextWin ne saurait être tenu responsable des pertes financières directes ou indirectes résultant de l'utilisation de ses analyses. L'Utilisateur est seul responsable de ses décisions de mise.
                        </p>
                    </section>

                    {/* Article 7 : Propriété Intellectuelle */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 7 : Propriété Intellectuelle</h3>
                        <p>
                            Tous les éléments du site (algorithmes, codes, interfaces, logos) sont protégés par le droit d'auteur. Toute extraction ou reproduction de données sans accord est interdite.
                        </p>
                    </section>

                    {/* Article 8 : Droit Applicable */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">Article 8 : Litiges et Droit applicable</h3>
                        <p>
                            Les présentes CGV sont régies par le droit international des affaires. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut, les tribunaux compétents seront ceux du siège social de <strong>NEXTWIN Digital Technologies LLC</strong>.
                        </p>
                    </section>

                </div>

                <div className="pt-10 text-center opacity-30 text-[10px] font-black uppercase tracking-widest text-gray-600 border-t border-gray-800">
                    NextWin Global Compliance • Version 2026.1
                </div>
            </Card>
        </div>
    );
};

export default TermsOfSalePage;
