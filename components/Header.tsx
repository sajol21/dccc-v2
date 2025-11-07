
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Motive', path: '/motive' },
  { name: 'Departments', path: '/departments' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Events', path: '/events' },
  { name: 'Leaders', path: '/leaders' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    color: '#2563eb', // blue-600
  };

  const mobileMenuVariants = {
    closed: {
        opacity: 0,
        y: "-100%",
        transition: { duration: 0.3 }
    },
    open: {
        opacity: 1,
        y: "0%",
        transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center">
            <img src="https://dhakacollegeculturalclub.com/logo.png" alt="DCCC Logo" className="h-10 w-auto" />
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200"
        >
          <nav className="flex flex-col items-center space-y-4 py-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-lg"
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Header;