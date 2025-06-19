import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useEmail } from './EmailContext';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './assets/Logo.png';
import MobileMenuButton from './MobileMenuButton';
import NavLinks from './NavLinks';

function HeaderBlue() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isMobileEmailOpen, setIsMobileEmailOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const { email, setEmail } = useEmail();

  const handleSignOut = () => {
    localStorage.removeItem('userEmail');
    setEmail(null);
    navigate("/login");
    window.location.reload();
  };

  const openLogoutConfirm = () => setIsLogoutConfirmOpen(true);
  const closeLogoutConfirm = () => setIsLogoutConfirmOpen(false);

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
      className={`fixed w-full top-0 z-50 bg-gradient-to-b from-blue-900/95 to-blue-800/95 backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? 'shadow-xl' : 'shadow-md'
      }`}
      style = {{ width: "106.55%", marginLeft: "-115px"}}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ml-0">
        <div className="flex h-20 items-center justify-between">
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

          <div className="hidden md:flex items-center space-x-6">
            <NavLinks orientation="horizontal" closeMenu={closeMobileMenu} />
            
            <div className="relative ml-4">
              <button
                onClick={() => setIsEmailOpen(!isEmailOpen)}
                className="px-5 py-2.5 font-medium text-blue-100 transition-all hover:bg-gradient-to-r hover:from-blue-300/20 hover:to-blue-400/20
                          focus:outline-none focus:ring-2 focus:ring-blue-300 border-2 border-blue-300/50 hover:border-blue-300
                          rounded-xl text-sm shadow-inner hover:shadow-md flex items-center space-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span> {email} </span>
              </button>

              <AnimatePresence>
                {isEmailOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 origin-top-right bg-gradient-to-b from-blue-900/95 to-blue-800/95 backdrop-blur-lg border-2 border-blue-300/50 rounded-xl overflow-hidden shadow-xl"
                  >
                    <div className="py-2">
                      <Link
                        to="/settings"
                        className="block px-4 py-3 text-sm text-blue-100 hover:bg-blue-300/20 transition-all duration-200"
                        onClick={() => setIsEmailOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        className="block w-full px-4 py-3 text-sm text-blue-100 hover:bg-blue-300/20 transition-all duration0-20"
                        onClick={openLogoutConfirm}
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <MobileMenuButton 
            isOpen={isMobileMenuOpen} 
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

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
                  <button
                    onClick={() => setIsMobileEmailOpen(!isMobileEmailOpen)}
                    className="w-full px-4 py-3 text-center font-medium text-blue-100 transition-all hover:bg-blue-900/50
                              focus:outline-none focus:ring-2 focus:ring-blue-300 border-2 border-blue-300/50
                              rounded-xl shadow-inner flex items-center justify-center space-x-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    <span>Email</span>
                  </button>

                  <AnimatePresence>
                    {isMobileEmailOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3">
                          <Link
                            to="/login"
                            className="w-full px-4 py-3 text-center font-medium text-blue-100 transition-all
                                      hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-blue-300
                                      border-2 border-blue-300/50 rounded-xl shadow-inner"
                            onClick={() => {
                              closeMobileMenu();
                              setIsMobileEmailOpen(false);
                            }}
                          >
                            Login
                          </Link>
                          <Link
                            to="/signup"
                            className="w-full px-4 py-3 text-center font-medium text-blue-900 
                                      bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl
                                      hover:from-blue-200 hover:to-blue-300 transition-all
                                      focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-md"
                            onClick={() => {
                              closeMobileMenu();
                              setIsMobileEmailOpen(false);
                            }}
                          >
                            Sign Up
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
      {isLogoutConfirmOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          style = {{ height: "700px"}}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl p-8 shadow-2xl relative"
          >
            <div className="flex items-start gap-4 max-w-xs">
              <div className="shrink-0 text-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-8">Are you sure you want to log out?</h3>
                
                <div className="flex gap-6">
                  <button
                    onClick={closeLogoutConfirm}
                    className="px-5 py-2.5 bg-gray-100/90 hover:bg-gray-200/80 text-gray-700 rounded-xl transition-all duration-200 flex items-center gap-2 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel</span>
                  </button>
                  
                  <button
                    onClick={handleSignOut}
                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </header>
  );
}

export default HeaderBlue;