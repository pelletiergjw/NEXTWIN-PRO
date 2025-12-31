
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
            <div className="mt-4 flex items-center gap-4">
              <a className="text-gray-400/70 cursor-not-allowed transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664 4.771 4.919 4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.626c-3.141 0-3.506.011-4.726.067-2.657.121-3.991 1.458-4.112 4.112-.056 1.22-.066 1.583-.066 4.726s.01 3.506.066 4.726c.12 2.658 1.458 3.991 4.112 4.112 1.22.056 1.583.066 4.726.066s3.506-.01 4.726-.066c2.658-.12 3.991-1.458 4.112-4.112.056-1.22.066-1.583.066-4.726s-.01-3.506-.066-4.726c-.12-2.658-1.458-3.991-4.112-4.112-1.22-.056-1.583-.066-4.726-.066zM12 6.873c-2.849 0-5.152 2.303-5.152 5.127s2.303 5.127 5.152 5.127 5.152-2.303 5.152-5.127-2.303-5.127-5.152-5.127zm0 8.627c-1.928 0-3.5-1.572-3.5-3.5s1.572-3.5 3.5-3.5 3.5 1.572 3.5 3.5-1.572 3.5-3.5 3.5zm6.406-8.22c-.618 0-1.118.5-1.118 1.118s.5 1.118 1.118 1.118 1.118-.5 1.118-1.118-.5-1.118-1.118-1.118z" />
                </svg>
              </a>
              <a className="text-gray-400/70 cursor-not-allowed transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a className="text-gray-400/70 cursor-not-allowed transition-colors" aria-label="YouTube">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M21.582 7.643A2.474 2.474 0 0019.82 5.88a29.351 29.351 0 00-7.82-1.076A29.351 29.351 0 004.18 5.88a2.474 2.474 0 00-1.762 1.763C2 9.079 2 12 2 12s0 2.921.418 4.357a2.474 2.474 0 001.762 1.763c1.7.453 7.82.453 7.82.453s6.12 0 7.82-.453a2.474 2.474 0 001.762-1.763C22 14.921 22 12 22 12s0-2.921-.418-4.357zM9.967 15.002V8.998l5.255 3.002-5.255 3.002z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">{t('footer_nav_title')}</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-orange-400">{t('nav_how_it_works')}</Link></li>
              <li><Link to="/sports-and-bets" className="text-gray-400 hover:text-orange-400">{t('sports_title')}</Link></li>
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
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <div className="text-xs mb-4">
            <p className="max-w-4xl mx-auto">
              {t('footer_warning')}
              <a href="http://www.joueurs-info-service.fr" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                {t('footer_warning_link_text')}
              </a>
            </p>
          </div>
          <div className="text-sm">
            &copy; 2026 NextWin.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
