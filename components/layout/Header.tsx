
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
    `relative px-1 py-2 text-sm lg:text-base transition-all duration-300 ease-in-out ${
      isActive 
        ? 'text-white font-bold' 
        : 'text-gray-400 hover:text-white'
    } after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transform after:scale-x-0 after:transition-transform after:duration-300 ${
      isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'
    }`;

  return (
    <header className="bg-[#1C1C2B]/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
      <nav className="container mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-3 items-center">
        
        {/* Colonne Gauche : Logo */}
        <div className="flex justify-start">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>
        </div>

        {/* Colonne Centre : Navigation (Parfaitement centrée sur l'écran) */}
        <div className="hidden md:flex justify-center items-center gap-8 lg:gap-12">
          <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>{t('nav_pricing')}</NavLink>
          <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
        </div>

        {/* Colonne Droite : Langues + Auth */}
        <div className="flex items-center justify-end gap-4 lg:gap-6">
          <div className="hidden lg:flex items-center gap-3 text-xs font-medium text-gray-500">
            <button 
              className={`transition-colors ${language === 'fr' ? 'text-orange-400' : 'hover:text-white'}`}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>
            <span className="w-px h-3 bg-gray-700"></span>
            <button 
              className={`transition-colors ${language === 'en' ? 'text-orange-400' : 'hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden xl:flex flex-col items-end mr-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">{t('welcome_user')}</span>
                  <span className="text-sm font-semibold text-white">{user?.name}</span>
                </div>
                <Link to="/dashboard"><Button variant="secondary" className="text-xs lg:text-sm px-4">{t('nav_dashboard')}</Button></Link>
                <Button onClick={logout} variant="ghost" className="text-xs hidden sm:block">{t('nav_logout')}</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" className="text-sm px-4">{t('nav_login')}</Button></Link>
                <Link to="/signup"><Button className="text-sm px-5 shadow-lg shadow-orange-500/20">{t('nav_signup')}</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
