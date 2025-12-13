import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Button } from './Button';
import { User as UserIcon, Menu, X, Home, Music, Info, BookOpen } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'library') => void;
  currentPage: 'home' | 'library';
}

export const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onLogout, onNavigate, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLogin = () => {
    setIsMobileMenuOpen(false);
    if (onLoginClick) onLoginClick();
  };

  const handleMobileLogout = () => {
    setIsMobileMenuOpen(false);
    if (onLogout) onLogout();
  };

  // Robust navigation handler preventing crashes and handling view switching
  const handleNavAction = (action: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    try {
      if (action === 'home') {
        if (onNavigate) onNavigate('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (action === 'library') {
        if (onNavigate) onNavigate('library');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (action.startsWith('#')) {
        const targetId = action.substring(1);
        
        // Logic to switch view then scroll
        const executeScroll = () => {
           const element = document.getElementById(targetId);
           if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
           } else {
              console.warn(`Navigation target #${targetId} not found.`);
           }
        };

        if (currentPage !== 'home') {
          if (onNavigate) onNavigate('home');
          // Wait for render
          setTimeout(executeScroll, 100);
        } else {
           executeScroll();
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const linkStyle = "text-base font-medium text-zinc-500 hover:text-white transition-colors duration-200 cursor-pointer";
  const activeLinkStyle = "text-base font-medium text-white transition-colors duration-200 cursor-pointer";
  const mobileLinkStyle = "text-xl font-light text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-4 py-2";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-black border-b border-white/5' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleNavAction('home', e)}>
            <span className="text-2xl font-bold font-heading text-sky-500 tracking-tight">
              SonicStream
            </span>
          </div>

          {/* Right Group: Navigation + User Actions */}
          <div className="flex items-center gap-8">
            
            {/* Desktop Navigation - Moved here */}
            <div className="hidden md:flex items-center space-x-8">
              <a onClick={(e) => handleNavAction('home', e)} className={currentPage === 'home' ? activeLinkStyle : linkStyle}>Home</a>
              <a onClick={(e) => handleNavAction('library', e)} className={currentPage === 'library' ? activeLinkStyle : linkStyle}>Library</a>
              <a href="#why-local" onClick={(e) => handleNavAction('#why-local', e)} className={linkStyle}>Why Local</a>
              <a href="#features" onClick={(e) => handleNavAction('#features', e)} className={linkStyle}>Features</a>
              <a href="#docs" onClick={(e) => handleNavAction('#docs', e)} className={linkStyle}>Docs</a>
            </div>

            {/* Divider between nav and auth (optional but nice) */}
            <div className="hidden md:block h-6 w-px bg-zinc-800"></div>

            <div className="flex items-center">
              {/* Desktop User/Login */}
              <div className="hidden md:block">
                {user ? (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium tracking-wide">
                      <UserIcon className="w-4 h-4" />
                      <span>{user.username}</span>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="text-base font-medium text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button variant="secondary" size="md" onClick={onLoginClick}>
                    Connect
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden ml-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-zinc-400 hover:text-white p-2 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black absolute left-0 right-0 h-[calc(100vh-6rem)] z-50 overflow-y-auto">
           <div className="px-6 py-8 space-y-6 flex flex-col h-full">
              <nav className="flex flex-col space-y-6 mt-4">
                <a onClick={(e) => handleNavAction('home', e)} className={mobileLinkStyle}>
                  <Home className="w-6 h-6 text-zinc-600" />
                  Home
                </a>
                <a onClick={(e) => handleNavAction('library', e)} className={mobileLinkStyle}>
                  <Music className="w-6 h-6 text-zinc-600" />
                  Library
                </a>
                <a href="#why-local" onClick={(e) => handleNavAction('#why-local', e)} className={mobileLinkStyle}>
                   <Info className="w-6 h-6 text-zinc-600" />
                   Why Local
                </a>
                <a href="#docs" onClick={(e) => handleNavAction('#docs', e)} className={mobileLinkStyle}>
                   <BookOpen className="w-6 h-6 text-zinc-600" />
                   Docs
                </a>
              </nav>
              
              <div className="mt-auto pb-12">
                {user ? (
                  <div className="space-y-6 border-t border-white/10 pt-6">
                     <div className="flex items-center gap-3 text-zinc-400">
                        <UserIcon className="w-6 h-6" />
                        <span className="font-mono text-base">{user.username}</span>
                     </div>
                     <Button variant="secondary" size="lg" onClick={handleMobileLogout} fullWidth>
                       Disconnect
                     </Button>
                  </div>
                ) : (
                  <Button variant="primary" size="lg" onClick={handleMobileLogin} fullWidth>
                    Connect Account
                  </Button>
                )}
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};