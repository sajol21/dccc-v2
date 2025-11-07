import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  alternateBackground?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = 'py-20 md:py-28', alternateBackground = false }) => {
  const bgColor = alternateBackground ? 'bg-gray-50 dark:bg-black' : 'bg-transparent';
  return (
    <section id={id} className={`relative ${bgColor} ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                {title}
             </span>
          </h2>
          {subtitle && <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
};

export default Section;