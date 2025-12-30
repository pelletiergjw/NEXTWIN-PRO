import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-sm font-medium transition-all duration-300 ease-in-out ${
      isActive 
        ? 'text-white' 
        : 'text-gray-400 hover:text-white'
    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transform after:scale-x-0 after:transition-transform after:duration-300 ${
      isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'
    }`;

  return (
    <header className="bg-[#10101A]/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/20">
      <div className="container mx-auto px-4 h-20 flex items-center">
        
        {/* Logo - Gauche */}
        <div className="w-1/4 flex-shrink-0">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Navigation - Centre */}
        <nav className="hidden lg:flex flex-grow justify-center items-center gap-8">
          <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
          <NavLink to="/bankroll-feature" className={navLinkClass}>{t('nav_bankroll')}</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>{t('nav_join_us' as any)}</NavLink>
          <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
        </nav>

        {/* Actions - Droite */}
        <div className="w-1/4 flex items-center justify-end gap-6">
          {/* Language Switcher - Toujours visible sur desktop */}
          <div className="hidden md:flex items-center gap-3 text-[11px] font-black tracking-widest text-gray-500 uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <button 
              className={`transition-all ${language === 'fr' ? 'text-orange-400 scale-110' : 'hover:text-white'}`}
              onClick={() => setLanguage('fr')}
            >FR</button>
            <span className="text-gray-800">|</span>
            <button 
              className={`transition-all ${language === 'en' ? 'text-orange-400 scale-110' : 'hover:text-white'}`}
              onClick={() => setLanguage('en')}
            >EN</button>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-bold text-white hover:text-orange-400 transition-colors">{t('nav_dashboard')}</Link>
                <button onClick={logout} className="text-xs text-gray-500 hover:text-white transition-colors">{t('nav_logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-white hover:text-orange-400 transition-colors hidden sm:inline">{t('nav_login')}</Link>
                <Link to="/signup">
                  <Button className="text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20">
                    {t('nav_signup')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button 
            className="lg:hidden p-2 text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#10101A] border-b border-gray-800 p-6 flex flex-col gap-4 animate-fadeIn">
          <NavLink to="/" className="text-white font-bold">{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className="text-gray-400">{t('nav_how_it_works')}</NavLink>
          <NavLink to="/bankroll-feature" className="text-gray-400">{t('nav_bankroll')}</NavLink>
          <NavLink to="/pricing" className="text-gray-400">{t('nav_join_us' as any)}</NavLink>
          <NavLink to="/faq" className="text-gray-400">{t('nav_faq')}</NavLink>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
            <button onClick={() => setLanguage('fr')} className={`text-xs font-bold ${language === 'fr' ? 'text-orange-400' : 'text-gray-500'}`}>FRANÇAIS</button>
            <button onClick={() => setLanguage('en')} className={`text-xs font-bold ${language === 'en' ? 'text-orange-400' : 'text-gray-500'}`}>ENGLISH</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;