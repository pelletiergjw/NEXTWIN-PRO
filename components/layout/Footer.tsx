
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { useLanguage } from '../../hooks/useLanguage';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#1C1C2B] border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-gray-400 text-sm">
              {t('footer_subtitle')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer_nav_title')}</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-orange-400">{t('nav_how_it_works')}</Link></li>
              <li><Link to="/sports-and-bets" className="text-gray-400 hover:text-orange-400">{t('footer_nav_sports')}</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-orange-400">{t('nav_pricing')}</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-orange-400">{t('nav_faq')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer_legal_title')}</h3>
            <ul className="space-y-2">
              <li><Link to="/legal-notice" className="text-gray-400 hover:text-orange-400">{t('footer_legal_notice')}</Link></li>
              <li><Link to="/terms-of-sale" className="text-gray-400 hover:text-orange-400">{t('footer_legal_tos')}</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-orange-400">{t('footer_legal_privacy')}</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-semibold text-white mb-4">{t('footer_contact_title')}</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-orange-400">{t('footer_contact_link')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} NextWin. {t('footer_copyright')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
