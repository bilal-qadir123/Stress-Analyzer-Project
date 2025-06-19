import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ orientation, closeMenu }) => {
  const links = [
    { to: "/about", text: "About" },
    { to: "/services", text: "Services" },
    { to: "/resources", text: "Resources" },
    { to: "/contact", text: "Contact" },
  ];

  return (
    <div 
      className={`${
        orientation === 'horizontal' 
          ? 'flex space-x-6' 
          : 'flex flex-col space-y-4 py-6 border-t border-blue-700, ml-10'
      }`}
    >
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={closeMenu}
          className={`text-sm font-medium text-white/90 hover:text-white transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 rounded-lg
                    ${orientation === 'vertical' ? 'text-base' : 'text-sm'}`}
        >
          {link.text}
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;