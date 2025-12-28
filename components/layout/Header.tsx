
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-gray-300 hover:text-white transition-colors duration-200 ${isActive ? 'text-orange-400 font-semibold' : ''}`;

  return (
    <header className="bg-[#1C1C2B]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>{t('nav_pricing')}</NavLink>
          <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <button 
              className={`focus:outline-none ${language === 'fr' ? 'font-semibold text-white' : 'hover:text-white'}`}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
            <span>|</span>
            <button 
              className={`focus:outline-none ${language === 'en' ? 'font-semibold text-white' : 'hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-gray-400 hidden sm:block">{t('welcome_user')} {user?.name}</span>
                <Link to="/dashboard"><Button variant="secondary">{t('nav_dashboard')}</Button></Link>
                <Button onClick={logout} variant="ghost">{t('nav_logout')}</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost">{t('nav_login')}</Button></Link>
                <Link to="/signup"><Button>{t('nav_signup')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
