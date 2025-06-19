import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from './assets/Logo.png';
import MobileMenuButton from './MobileMenuButton';
import Image from "./assets/Image3.jpg";
import NavLinks from './NavLinks';
import HeaderBlue from './HeaderBlue';
import QuestionsArray from './QuestionsArray';
const Questions = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div> 
    <HeaderBlue />
    <div 
      className="landing relative w-full z-10" 
      style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        width: "100%",
        height: "105%",
        zIndex: 1,
      }}
    >
      <img 
        src={Image} 
        alt="Logo" 
        style={{ width: "100%", height: "75%", objectFit: "cover", objectPosition: "50% 10%" }}
        />
      {/* Black overlay */}
      <div 
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "75%",
          background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)), " +
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0))",}}
      />
      <h1 className='heading' style={{position: "absolute", top: "33%", left: "50%", transform: "translate(-50%, -50%)", color: "white", lineHeight: "1.2", fontSize: "85px", fontWeight: "bold"}}>  
        A Stitch in Time Saves Nine  
      </h1>  
      <p className='subheading' style={{position: "absolute", top: "55%", left: "50%", transform: "translate(-50%, -50%)", color: "white", fontSize: "20px", fontWeight: "normal"}}>  
        Don’t let stress steal your sunshine take our quick test to unravel the knots before they tighten.  
      </p>
      
    </div>
    <QuestionsArray />
    </div>
  );
};

export default Questions;