import React from 'react';

const MobileMenuButton = ({ isOpen, onClick }) => (
  <button
    type="button"
    className="md:hidden p-2 rounded-lg text-blue-100 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
  >
    <svg
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  </button>
);

export default MobileMenuButton;