import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const navLinks = [
  { name: 'About', path: '/about' },
  { name: 'Departments', path: '/departments' },
  { name: 'Events', path: '/events' },
  { name: 'Achievements', path: '/achievements' },
  { name: 'Team', path: '/team' },
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

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    );
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeLinkStyle = {
    color: '#4f46e5',
  };
  
  const menuVariants = {
    open: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    closed: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1, when: "afterChildren" } },
  };

  const navItemVariants = {
    open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } },
  };

  return (
    <>
      <header className={`w-full sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50 transition-all duration-300 ${scrolled ? 'shadow-md shadow-gray-200/50 dark:shadow-black/20 border-b border-gray-200 dark:border-gray-800' : 'border-b border-transparent'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center">
              <img src="https://dhakacollegeculturalclub.com/logo.png" alt="DCCC Logo" className="h-10 w-auto" />
            </NavLink>
            
            <div className="hidden md:flex items-center">
              <nav className="flex space-x-8">
                  {navLinks.map((link) => (
                  <NavLink
                      key={link.name}
                      to={link.path}
                      style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                  >
                      {link.name}
                  </NavLink>
                  ))}
              </nav>
              <div className="flex items-center gap-2 ml-4">
                 <ThemeToggle />
                 <a 
                    href="https://dhakacollegeculturalclub.com/join" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-4 px-5 py-2 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md shadow-red-500/30"
                >
                    Join DCCC
                </a>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-2">
               <ThemeToggle />
               <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 focus:outline-none z-50">
                    <svg width="23" height="23" viewBox="0 0 23 23">
                        <Path variants={{ closed: { d: "M 2 2.5 L 20 2.5" }, open: { d: "M 3 16.5 L 17 2.5" } }} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3 }} />
                        <Path d="M 2 9.423 L 20 9.423" variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.2 }} />
                        <Path variants={{ closed: { d: "M 2 16.346 L 20 16.346" }, open: { d: "M 3 2.5 L 17 16.346" } }} animate={isOpen ? "open" : "closed"} transition={{ duration: 0.3 }} />
                    </svg>
                </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-40"
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
                  className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-semibold text-2xl"
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