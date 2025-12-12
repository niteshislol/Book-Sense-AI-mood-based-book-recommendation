import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface NavbarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, setPage, theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'discover', label: 'Discover' },
    { id: 'top-books', label: 'Top Books' },
    { id: 'mood-ai', label: 'Mood AI' },
  ];

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] max-w-4xl`}>
      <div 
        className={`
          flex items-center justify-between px-6 py-3 rounded-full 
          transition-all duration-300
          ${scrolled 
            ? 'bg-white/80 dark:bg-[#0b0e16]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg' 
            : 'bg-white/30 dark:bg-white/5 backdrop-blur-[18px] border border-white/20 dark:border-white/10'}
        `}
      >
        {/* Logo */}
        <div 
            className="text-xl font-poppins font-extrabold cursor-pointer flex items-center gap-2"
            onClick={() => setPage('home')}
        >
          <span className="text-gradient">BookSense</span>
          <span className="text-gray-800 dark:text-white">AI</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group
                ${currentPage === item.id 
                  ? 'text-gray-900 dark:text-white bg-white/40 dark:bg-white/10 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}
              `}
            >
                <span className="relative z-10">{item.label}</span>
                {currentPage === item.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6f57ff] to-[#5da6ff] opacity-10 dark:opacity-20" />
                )}
            </button>
          ))}
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="ml-4 w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
               <span className="text-lg">☀️</span>
            ) : (
               <span className="text-lg">🌙</span>
            )}
          </button>
        </div>

        {/* Mobile Hamburger (Simplified) */}
        <div className="md:hidden flex items-center gap-4">
             <button onClick={toggleTheme} className="text-xl">
                 {theme === 'dark' ? '☀️' : '🌙'}
             </button>
            <div className="text-gray-800 dark:text-white text-2xl cursor-pointer">
                ≡
            </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;