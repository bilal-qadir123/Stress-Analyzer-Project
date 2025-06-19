import { createContext, useContext, useState, useEffect } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedTime = localStorage.getItem('emailTimestamp');
    if (savedEmail && savedTime && Date.now() - savedTime < 30 * 60 * 1000) {
      return savedEmail;
    }
    localStorage.removeItem('userEmail');
    localStorage.removeItem('emailTimestamp');
    return null;
  });

  useEffect(() => {
    if (email) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('emailTimestamp', Date.now());
      const timer = setTimeout(() => {
        setEmail(null);
      }, 1800000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('emailTimestamp');
    }
  }, [email]);

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => useContext(EmailContext);
