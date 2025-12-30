
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
    <div>
      <h1 className="text-4xl font-bold text-white mb-4">{t('dashboard_title')}</h1>
      <p className="text-lg text-gray-300 mb-8">{t('dashboard_welcome')} {user?.name}!</p>

      {!isSubscribed && (
        <Card className="mb-8 bg-orange-900/50 border-orange-700">
          <h2 className="text-xl font-semibold text-orange-300 mb-2">{t('dashboard_sub_alert_title')}</h2>
          <p className="text-orange-200">
            {t('dashboard_sub_alert_desc')}
          </p>
          <Link to="/pricing" className="mt-4 inline-block">
            <Button>{t('see_pricing')}</Button>
          </Link>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title={t('dashboard_card_picks_title')}
          description={t('dashboard_card_picks_desc')}
          link="/daily-picks"
          linkText={t('dashboard_card_picks_cta')}
          disabled={!isSubscribed}
          highlight
        />
        <DashboardCard 
          title={t('dashboard_card_analysis_title')}
          description={t('dashboard_card_analysis_desc')}
          link="/analysis"
          linkText={t('dashboard_card_analysis_cta')}
          disabled={!isSubscribed}
        />
        <DashboardCard 
          title={t('dashboard_card_bankroll_title')}
          description={t('dashboard_card_bankroll_desc')}
          link="/bankroll"
          linkText={t('dashboard_card_bankroll_cta')}
          highlight
        />
        <DashboardCard 
          title={t('dashboard_card_history_title')}
          description={t('dashboard_card_history_desc')}
          link="/history"
          linkText={t('dashboard_card_history_cta')}
          disabled={!isSubscribed}
        />
         <DashboardCard 
          title={t('dashboard_card_sub_title')}
          description={t('dashboard_card_sub_desc')}
          link="/subscription"
          linkText={t('dashboard_card_sub_cta')}
        />
         <DashboardCard 
          title={t('dashboard_card_profile_title')}
          description={t('dashboard_card_profile_desc')}
          link="/profile"
          linkText={t('dashboard_card_profile_cta')}
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
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, link, linkText, disabled = false, highlight = false }) => {
    const { t } = useLanguage();
    return (
        <Card className={`flex flex-col justify-between h-full transition-all duration-300 ${disabled ? 'opacity-50' : 'hover:border-orange-500/50'} ${highlight ? 'border-orange-500 ring-1 ring-orange-500/20' : ''}`}>
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    {highlight && <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">Premium</span>}
                </div>
                <p className="text-gray-400 mb-6">{description}</p>
            </div>
            {disabled ? (
                <Button disabled className="w-full mt-auto cursor-not-allowed">{t('dashboard_card_disabled')}</Button>
            ) : (
                <Link to={link}>
                    <Button className={`w-full mt-auto ${highlight ? 'shadow-lg shadow-orange-500/20' : ''}`}>{linkText}</Button>
                </Link>
            )}
        </Card>
    )
}


export default DashboardPage;
