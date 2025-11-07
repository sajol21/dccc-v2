import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAchievements } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Achievement } from '../types';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const date = new Date(achievement.date);
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="w-full md:w-64 flex-shrink-0">
                    <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-40 object-cover rounded-lg" />
                 </div>
                <div className="flex-1 text-center md:text-left">
                     <p className="text-sm font-semibold text-blue-600 mb-1">{achievement.category} &bull; {date.getFullYear()}</p>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const AchievementsPage: React.FC = () => {
    const { data: achievements, loading, error } = useData(getAchievements);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    const categories = useMemo(() => {
        if (!achievements) return [];
        return ['All', ...Array.from(new Set(achievements.map(a => a.category)))];
    }, [achievements]);

    const filteredAchievements = useMemo(() => {
        if (!achievements) return [];
        if (selectedCategory === 'All') return achievements;
        return achievements.filter(a => a.category === selectedCategory);
    }, [achievements, selectedCategory]);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                     <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Our Achievements
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        A journey of excellence, dedication, and countless moments of pride.
                    </p>
                </motion.div>
                
                <div className="flex justify-center flex-wrap gap-2 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                selectedCategory === category 
                                ? 'bg-blue-600 text-white shadow' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading && <Loader />}
                {error && <p className="text-center text-red-500">Failed to load achievements.</p>}

                {filteredAchievements && (
                    <div className="space-y-6 max-w-4xl mx-auto">
                         <AnimatePresence mode="wait">
                            <motion.div key={selectedCategory}>
                                {filteredAchievements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(ach => (
                                    <AchievementCard key={ach.id} achievement={ach} />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsPage;