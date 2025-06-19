import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './assets/Logo.png';
import MobileMenuButton from './MobileMenuButton';
import NavLinks from './NavLinks';
import { useEmail } from './EmailContext';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { email } = useEmail();

  const handleClick = (e) => {
    if (email) {
      e.preventDefault(); 
      navigate("/questions"); 
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header 
    className={`fixed w-full top-0 z-50 bg-transparent backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : 'shadow-md'
      }`}
      style = {{ width: "106.55%", marginLeft: "-70px"}}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ml-0">
        <div className="flex h-20 items-center justify-between">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-transform hover:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-xl p-1"
              onClick={closeMobileMenu}
            >
              <img
                src={Logo}
                alt="Peaceful Journey Logo"
                className="h-14 w-auto drop-shadow-md"
              />
              <span className="text-white font-semibold text-xl hidden md:block tracking-tight bg-gradient-to-r from-blue-100 to-blue-200 bg-clip-text text-transparent">
                Peaceful Journey
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks orientation="horizontal" closeMenu={closeMobileMenu} />
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 ml-4">
                    
                  <Link
                    to="/login"
                    onClick={handleClick}
                    className="px-5 py-2.5 font-medium text-blue-100 transition-all
                              hover:bg-gradient-to-r hover:from-blue-300 hover:to-blue-400 focus:outline-none 
                              focus:ring-2 focus:ring-blue-300 border-2 border-blue-300/50 
                              hover:border-blue-300 rounded-xl text-sm shadow-inner hover:shadow-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-blue-300 to-blue-400 px-6 py-2.5
                              font-medium text-blue-900 shadow-lg transition-all hover:from-blue-200
                              hover:to-blue-300 hover:shadow-xl focus:outline-none focus:ring-2
                              focus:ring-blue-300/50 rounded-xl text-sm"
                  >
                    Sign Up
                  </Link>              
            </div>
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-2 pb-6 space-y-4">
                <NavLinks orientation="vertical" closeMenu={closeMobileMenu} />
                
                <div className="px-4 flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="w-full px-4 py-3 text-center font-medium text-blue-100 transition-all
                              hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-300
                              border-2 border-blue-300/50 rounded-xl shadow-inner"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/login"
                    className="w-full px-4 py-3 text-center font-medium text-blue-900 
                              bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl
                              hover:from-blue-200 hover:to-blue-300 transition-all
                              focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                    onClick={closeMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header