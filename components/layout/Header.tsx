
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

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to ensure scroll is restored if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-1 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-in-out ${
      isActive 
        ? 'text-white' 
        : 'text-gray-400 hover:text-white'
    } after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-orange-500 after:to-pink-500 after:transform after:scale-x-0 after:transition-transform after:duration-300 ${
      isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-4 text-center text-lg font-black uppercase tracking-wider transition-all duration-300 ${
        isActive ? 'text-orange-400' : 'text-gray-400 hover:text-white'
    }`;

  return (
    <header className="bg-[#10101A] lg:bg-[#10101A]/90 lg:backdrop-blur-xl sticky top-0 z-[100] border-b border-white/5">
      <div className="container mx-auto px-4 h-20 flex items-center">
        
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo className="scale-90 md:scale-100" />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>{t('nav_home')}</NavLink>
          <NavLink to="/how-it-works" className={navLinkClass}>{t('nav_how_it_works')}</NavLink>
          <NavLink to="/bankroll-feature" className={navLinkClass}>{t('nav_bankroll')}</NavLink>
          <NavLink to="/pricing" className={navLinkClass}>{t('nav_join_us' as any)}</NavLink>
          <NavLink to="/faq" className={navLinkClass}>{t('nav_faq')}</NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-3 text-[10px] font-black tracking-widest text-gray-500 uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <button 
                  className={`transition-all ${language === 'fr' ? 'text-orange-400' : 'hover:text-white'}`}
                  onClick={() => setLanguage('fr')}
                >FR</button>
                <span className="text-gray-800">|</span>
                <button 
                  className={`transition-all ${language === 'en' ? 'text-orange-400' : 'hover:text-white'}`}
                  onClick={() => setLanguage('en')}
                >EN</button>
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-6">
                  <Link to="/dashboard" className="text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-orange-400 transition-colors">{t('nav_dashboard')}</Link>
                  <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors">{t('nav_logout')}</button>
                </div>
              ) : (
                <div className="flex items-center gap-8">
                  <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-orange-400 transition-colors">{t('nav_login')}</Link>
                  <Link to="/signup">
                    <Button className="text-[11px] px-8 py-3 rounded-xl shadow-lg shadow-orange-500/20 uppercase tracking-[0.2em] font-black">
                      {t('nav_signup')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Trigger - PERFECTLY CENTERED HAMBURGER */}
            <button 
              className="lg:hidden w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all relative z-[110]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between items-center relative">
                  <span 
                    className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                      isMenuOpen ? 'rotate-45 absolute top-1/2 -translate-y-1/2' : ''
                    }`}
                  ></span>
                  <span 
                    className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out ${
                      isMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
                    }`}
                  ></span>
                  <span 
                    className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-in-out origin-center ${
                      isMenuOpen ? '-rotate-45 absolute top-1/2 -translate-y-1/2' : ''
                    }`}
                  ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div 
        className={`lg:hidden fixed top-20 left-0 right-0 z-[90] bg-[#1C1C2B] border-t border-white/10 shadow-2xl transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-[110%]'}`}
      >
        <div className="container mx-auto px-6 py-8 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* Main Navigation */}
          <nav className="flex flex-col items-center text-center gap-2 border-b border-white/10 pb-6">
              <NavLink to="/" className={mobileNavLinkClass}>{t('nav_home')}</NavLink>
              <NavLink to="/how-it-works" className={mobileNavLinkClass}>{t('nav_how_it_works')}</NavLink>
              <NavLink to="/bankroll-feature" className={mobileNavLinkClass}>{t('nav_bankroll')}</NavLink>
              <NavLink to="/pricing" className={mobileNavLinkClass}>{t('nav_join_us' as any)}</NavLink>
              <NavLink to="/faq" className={mobileNavLinkClass}>{t('nav_faq')}</NavLink>
          </nav>

          <div className="pt-6">
              <div className="w-full max-w-sm mx-auto space-y-6">
                  {/* Auth Actions */}
                  {isAuthenticated ? (
                      <div className="flex flex-col items-center gap-4">
                          <Link to="/dashboard" className="w-full">
                          <Button className="w-full py-3 text-sm font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                              {t('nav_dashboard')}
                          </Button>
                          </Link>
                          <button 
                              onClick={logout}
                              className="w-full text-center py-2 text-xs font-black text-gray-500 uppercase tracking-widest"
                          >
                              {t('nav_logout')}
                          </button>
                      </div>
                      ) : (
                      <div className="flex gap-4">
                          <Link to="/login" className="w-full">
                              <Button variant="secondary" className="w-full py-3 text-xs font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10">
                                  {t('nav_login')}
                              </Button>
                          </Link>
                          <Link to="/signup" className="w-full">
                          <Button className="w-full py-3 text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                              {t('nav_signup')}
                          </Button>
                          </Link>
                      </div>
                  )}

                  {/* Language Switcher */}
                  <div className="flex items-center justify-center gap-6 pt-4">
                      <button 
                          onClick={() => setLanguage('fr')}
                          className={`text-xs font-black tracking-widest transition-all ${language === 'fr' ? 'text-orange-400' : 'text-gray-600 hover:text-white'}`}
                      >
                          FRANÇAIS
                      </button>
                      <div className="w-px h-4 bg-gray-800"></div>
                      <button 
                          onClick={() => setLanguage('en')}
                          className={`text-xs font-black tracking-widest transition-all ${language === 'en' ? 'text-orange-400' : 'text-gray-600 hover:text-white'}`}
                      >
                          ENGLISH
                      </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
