
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../hooks/useLanguage';

const DashboardPage: React.FC = () => {
  const { user, isSubscribed } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-4">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{t('dashboard_title')}</h1>
        <p className="text-base md:text-lg text-gray-400 font-medium">{t('dashboard_welcome')} {user?.name}!</p>
      </div>

      {!isSubscribed && (
        <Card className="mb-10 bg-orange-900/20 border-orange-500/30 p-8 rounded-[2rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
                <h2 className="text-2xl font-black text-orange-400 mb-2">{t('dashboard_sub_alert_title')}</h2>
                <p className="text-orange-200/80 font-medium">
                    {t('dashboard_sub_alert_desc')}
                </p>
            </div>
            <Link to="/pricing" className="flex-shrink-0">
                <Button className="w-full md:w-auto px-10 py-4 shadow-xl shadow-orange-500/20">{t('see_pricing')}</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <DashboardCard 
          title={t('dashboard_card_picks_title')}
          description={t('dashboard_card_picks_desc')}
          link="/daily-picks"
          linkText={t('dashboard_card_picks_cta')}
          disabled={!isSubscribed}
          highlight
          icon="🎯"
        />
        <DashboardCard 
          title={t('dashboard_card_analysis_title')}
          description={t('dashboard_card_analysis_desc')}
          link="/analysis"
          linkText={t('dashboard_card_analysis_cta')}
          disabled={!isSubscribed}
          icon="🧠"
        />
        <DashboardCard 
          title={t('dashboard_card_bankroll_title')}
          description={t('dashboard_card_bankroll_desc')}
          link="/bankroll"
          linkText={t('dashboard_card_bankroll_cta')}
          highlight
          icon="🏦"
        />
        <DashboardCard 
          title={t('dashboard_card_history_title')}
          description={t('dashboard_card_history_desc')}
          link="/history"
          linkText={t('dashboard_card_history_cta')}
          disabled={!isSubscribed}
          icon="📜"
        />
         <DashboardCard 
          title={t('dashboard_card_sub_title')}
          description={t('dashboard_card_sub_desc')}
          link="/subscription"
          linkText={t('dashboard_card_sub_cta')}
          icon="💳"
        />
         <DashboardCard 
          title={t('dashboard_card_profile_title')}
          description={t('dashboard_card_profile_desc')}
          link="/profile"
          linkText={t('dashboard_card_profile_cta')}
          icon="👤"
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
    title: string;
    description: string;
    link: string;
    linkText: string;
    disabled?: boolean;
    highlight?: boolean;
    icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, link, linkText, disabled = false, highlight = false, icon }) => {
    const { t } = useLanguage();
    return (
        <Card className={`flex flex-col h-full p-8 transition-all duration-500 rounded-[2.5rem] border-gray-800/40 relative overflow-hidden group ${disabled ? 'opacity-50 grayscale' : 'hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/5'} ${highlight ? 'ring-1 ring-orange-500/20' : ''}`}>
            {/* Background Icon Decoration */}
            <div className="absolute -top-6 -right-6 text-7xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none transform group-hover:rotate-12 duration-500">
                {icon}
            </div>

            <div className="relative z-10 flex-grow">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {icon}
                    </div>
                    {highlight && <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg shadow-orange-500/20 tracking-widest">Premium</span>}
                </div>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-orange-400 transition-colors">{title}</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed mb-8">{description}</p>
            </div>

            <div className="relative z-10 mt-auto">
                {disabled ? (
                    <Button disabled className="w-full py-4 text-xs font-black uppercase tracking-widest bg-gray-800 border border-gray-700 text-gray-500 cursor-not-allowed">
                        {t('dashboard_card_disabled')}
                    </Button>
                ) : (
                    <Link to={link}>
                        <Button className={`w-full py-4 text-xs font-black uppercase tracking-widest ${highlight ? 'shadow-xl shadow-orange-500/20' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
                            {linkText}
                        </Button>
                    </Link>
                )}
            </div>
        </Card>
    )
}

export default DashboardPage;
