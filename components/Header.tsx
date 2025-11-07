import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'About', path: '/about' },
  { name: 'Departments', path: '/departments' },
  { name: 'Events', path: '/events' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Panel', path: '/panel' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    color: '#2563eb', // blue-600
  };

  const mobileMenuVariants = {
    closed: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: { duration: 0.2 }
    },
    open: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center">
            <img src="https://dhakacollegeculturalclub.com/logo.png" alt="DCCC Logo" className="h-10 w-auto" />
          </NavLink>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex space-x-8">
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
            <a 
                href="https://dhakacollegeculturalclub.com/join" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-8 px-5 py-2 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md shadow-red-500/30"
            >
                Join DCCC
            </a>
          </div>


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
            className="md:hidden fixed top-24 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg"
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
             <a 
                href="https://dhakacollegeculturalclub.com/join" 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => setIsOpen(false)}
                className="mt-6 px-8 py-3 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
            >
                Join DCCC
            </a>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Header;