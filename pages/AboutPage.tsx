import React from 'react';
import { motion } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import Section from '../components/Section';

const Stat: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
    >
        <p className="text-4xl md:text-5xl font-extrabold text-indigo-600">{value}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium tracking-wide">{label}</p>
    </motion.div>
);

const AboutPage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error || !appData?.about) return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    
    const { about } = appData;
    
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Hero Section */}
            <header className="relative pt-16 pb-16 md:pt-24 md:pb-24 bg-gray-50 dark:bg-black overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                        Our Story
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                    >
                        {about.visionTagline}
                    </motion.p>
                </div>
            </header>

            <main className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-3"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Origin and Vision</h2>
                            <div 
                                className="prose prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed max-w-none"
                                dangerouslySetInnerHTML={{ __html: about.fullText }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-2 sticky top-24"
                        >
                             <img src={about.imageUrl} alt="About DCCC" className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]" loading="lazy" decoding="async" />
                        </motion.div>
                    </div>
                </div>
            </main>

            {about.stats && about.stats.length > 0 && (
                <Section title="By The Numbers" alternateBackground>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {about.stats.map((stat, index) => <Stat key={index} {...stat} index={index} />)}
                    </div>
                </Section>
            )}
        </div>
    );
};

export default AboutPage;