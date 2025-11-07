import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAchievements } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Achievement } from '../types';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const date = new Date(achievement.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-xl border border-gray-200/80 overflow-hidden group flex flex-col shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="overflow-hidden aspect-[16/10]">
                <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-sm font-semibold text-blue-600 mb-2">{achievement.category}</span>
                <h3 className="font-bold text-xl text-gray-900 leading-tight mb-3 flex-grow">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                <div className="mt-auto border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-500 font-medium">{formattedDate}</p>
                </div>
            </div>
        </motion.div>
    );
};

const AchievementsPage: React.FC = () => {
    const { data: achievements, loading, error } = useData(getAchievements);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        if (!achievements) return ['All'];
        // Sort achievements by date descending before extracting categories to ensure a somewhat logical order
        const sorted = [...achievements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const uniqueCategories = [...new Set(sorted.map(a => a.category))];
        return ['All', ...uniqueCategories];
    }, [achievements]);

    const filteredAchievements = useMemo(() => {
        if (!achievements) return [];
        // Always sort by date so newest appear first
        const sorted = [...achievements].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (selectedCategory === 'All') {
            return sorted;
        }
        return sorted.filter(a => a.category === selectedCategory);
    }, [achievements, selectedCategory]);

    return (
        <div className="pt-16 pb-20 min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                           Celebrating Our Success
                        </span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        A showcase of our club's milestones, awards, and noteworthy accomplishments through the years.
                    </p>
                </motion.div>

                {loading && <div className="flex justify-center"><Loader /></div>}
                {error && <p className="text-center text-red-500">Failed to load achievements.</p>}

                {achievements && achievements.length > 0 && (
                    <>
                        <div className="flex justify-center flex-wrap gap-2 mb-12">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 border ${
                                        selectedCategory === category
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        <motion.div 
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence>
                                {filteredAchievements.map(achievement => (
                                    <AchievementCard key={achievement.id} achievement={achievement} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}

                {!loading && achievements && achievements.length === 0 && (
                     <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16 text-gray-500">
                        <p className="text-xl">No achievements have been added yet.</p>
                        <p>Check back later to see our accomplishments!</p>
                     </motion.div>
                 )}
            </div>
        </div>
    );
};

export default AchievementsPage;