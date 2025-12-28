
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const SubscriptionPage: React.FC = () => {
    const { isSubscribed, cancelSubscription } = useAuth();
    const { t } = useLanguage();

    return (
        <div>
            <h1 className="text-4xl font-bold text-center text-white mb-8">{t('sub_title')}</h1>
            <Card className="max-w-2xl mx-auto">
                {isSubscribed ? (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">{t('sub_status_active')}</h2>
                        <div className="bg-gray-900 p-4 rounded-lg mb-6">
                            <p className="text-gray-300">{t('sub_plan')} : <span className="font-semibold text-white">{t('sub_plan_name')}</span></p>
                            <p className="text-gray-300">{t('sub_rate')} : <span className="font-semibold text-white">{t('sub_rate_value')}</span></p>
                            <p className="text-gray-300">{t('sub_renewal')} : <span className="font-semibold text-white">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</span></p>
                        </div>
                        <p className="text-gray-400 mb-6">{t('sub_cancel_info')}</p>
                        <Button variant="secondary" onClick={cancelSubscription} className="bg-red-800 hover:bg-red-700">
                            {t('sub_cancel_button')}
                        </Button>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-4">{t('sub_status_inactive')}</h2>
                        <p className="text-gray-300 mb-6">{t('sub_inactive_cta_text')}</p>
                        <Link to="/pricing">
                            <Button>{t('see_pricing')}</Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SubscriptionPage;
