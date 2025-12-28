
import React from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from './ui/Card';
import Button from './ui/Button';
import { useLanguage } from '../hooks/useLanguage';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requireSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireSubscription = false }) => {
  const { isAuthenticated, isSubscribed } = useAuth();
  const location = useLocation();
  const { t } = useLanguage();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireSubscription && !isSubscribed) {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card className="max-w-md text-center">
                <h2 className="text-2xl font-bold text-white mb-2">{t('protected_title')}</h2>
                <p className="text-gray-400 mb-6">{t('protected_subtitle')}</p>
                <Link to="/pricing">
                    <Button>{t('see_pricing')}</Button>
                </Link>
            </Card>
        </div>
    );
  }

  return children;
};

export default ProtectedRoute;
