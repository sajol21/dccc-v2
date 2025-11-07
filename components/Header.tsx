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

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeLinkStyle = {
    color: '#2563eb', // blue-600
  };
  
  const menuVariants = {
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const navItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-6xl bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg transition-all duration-300">
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
               <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 focus:outline-none z-50">
                    <svg width="23" height="23" viewBox="0 0 23 23">
                        <Path
                            variants={{
                                closed: { d: "M 2 2.5 L 20 2.5" },
                                open: { d: "M 3 16.5 L 17 2.5" }
                            }}
                            animate={isOpen ? "open" : "closed"}
                            transition={{ duration: 0.3 }}
                        />
                        <Path
                            d="M 2 9.423 L 20 9.423"
                            variants={{
                                closed: { opacity: 1 },
                                open: { opacity: 0 }
                            }}
                            animate={isOpen ? "open" : "closed"}
                            transition={{ duration: 0.2 }}
                        />
                        <Path
                            variants={{
                                closed: { d: "M 2 16.346 L 20 16.346" },
                                open: { d: "M 3 2.5 L 17 16.346" }
                            }}
                            animate={isOpen ? "open" : "closed"}
                            transition={{ duration: 0.3 }}
                        />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-xl z-50"
        >
          <motion.nav 
            className="flex flex-col items-center justify-center h-full space-y-8"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={navItemVariants}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-semibold text-2xl"
                >
                  {link.name}
                </NavLink>
              </motion.div>
            ))}
             <motion.div variants={navItemVariants}>
                <a 
                    href="https://dhakacollegeculturalclub.com/join" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    onClick={() => setIsOpen(false)}
                    className="mt-6 px-10 py-4 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
                >
                    Join DCCC
                </a>
              </motion.div>
          </motion.nav>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
};

export default Header;