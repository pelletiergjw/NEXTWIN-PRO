
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  // Fermer le menu lors du changement de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-base transition-all duration-300 ease-in-out ${
      isActive 
        ? 'text-white font-bold' 
        : 'text-gray-400 hover:text-white'
    } lg:after:content-[''] lg:after:absolute lg:after:bottom-0 lg:after:left-0 lg:after:w-full lg:after:h-0.5 lg:after:bg-gradient-to-r lg:after:from-orange-500 lg:after:to-pink-500 lg:after:transform lg:after:scale-x-0 lg:after:transition-transform lg:after:duration-300 ${
      isActive ? 'lg:after:scale-x-100' : 'hover:lg:after:scale-x-100'
    }`;

  return (
    <header className="bg-[#1C1C2B]/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto px-4 h-20 w-full flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        
        {/* Logo - Toujours à gauche */}
        <div className="flex justify-start z-50">
          <Link to="/" className="flex-shrink-0">
            <Logo />
          </Link>
        </div>

        {/* Navigation Desktop - Centrée */}
        <div className="hidden lg:flex justify-center items-center gap-8 lg:gap-10 whitespace-nowrap">
          <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
          <NavLink to="/bankroll-feature" className={navLinkClass}>{t('nav_bankroll')}</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>{t('nav_pricing')}</NavLink>
          <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
        </div>

        {/* Actions Desktop - À droite */}
        <div className="hidden lg:flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mr-2">
            <button 
              className={`transition-colors ${language === 'fr' ? 'text-orange-400 font-bold' : 'hover:text-white'}`}
              onClick={() => setLanguage('fr')}
            >FR</button>
            <span className="w-px h-3 bg-gray-700"></span>
            <button 
              className={`transition-colors ${language === 'en' ? 'text-orange-400 font-bold' : 'hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >EN</button>
          </div>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard"><Button variant="secondary" className="text-sm px-4">{t('nav_dashboard')}</Button></Link>
                <Button onClick={logout} variant="ghost" className="text-xs px-2">{t('nav_logout')}</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" className="text-sm px-3">{t('nav_login')}</Button></Link>
                <Link to="/signup"><Button className="text-sm px-4 shadow-lg shadow-orange-500/20">{t('nav_signup')}</Button></Link>
              </>
            )}
          </div>
        </div>

        {/* Bouton Toggle Mobile */}
        <button 
          className="lg:hidden z-50 p-2 text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu Mobile Overlay */}
      <div className={`lg:hidden absolute top-20 left-0 w-full bg-[#1C1C2B] border-b border-gray-800 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex flex-col p-6 gap-6">
          <div className="flex flex-col gap-4">
            <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
            <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
            <NavLink to="/bankroll-feature" className={navLinkClass}>{t('nav_bankroll')}</NavLink>
            <NavLink to="/pricing" className={navLinkClass}>{t('nav_pricing')}</NavLink>
            <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
          </div>
          
          <div className="h-px bg-gray-800 w-full"></div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
               <button onClick={() => setLanguage('fr')} className={`text-sm ${language === 'fr' ? 'text-orange-400 font-bold' : 'text-gray-500'}`}>Français</button>
               <button onClick={() => setLanguage('en')} className={`text-sm ${language === 'en' ? 'text-orange-400 font-bold' : 'text-gray-500'}`}>English</button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="w-full">
                  <Button variant="secondary" className="w-full py-3">{t('nav_dashboard')}</Button>
                </Link>
                <Button onClick={logout} variant="ghost" className="w-full">{t('nav_logout')}</Button>
              </>
            ) : (
              <>
                <Link to="/signup" className="w-full order-1">
                  <Button className="w-full py-3 shadow-lg shadow-orange-500/20">{t('nav_signup')}</Button>
                </Link>
                <Link to="/login" className="w-full order-2">
                  <Button variant="ghost" className="w-full py-3">{t('nav_login')}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
