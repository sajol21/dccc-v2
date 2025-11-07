
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getAchievements } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Achievement } from '../types';

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => {
    const date = new Date(achievement.date);
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-lg border border-gray-200"
        >
            <img src={achievement.imageUrl} alt={achievement.title} className="w-full md:w-1/3 h-auto object-cover rounded-md shadow-md" />
            <div className="flex-1">
                <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-bold text-blue-600">{achievement.title}</h3>
                    <p className="text-gray-500 font-mono">{date.getFullYear()}</p>
                </div>
                <p className="text-sm text-gray-400 mb-4">{achievement.category} - {date.toLocaleDateString()}</p>
                <p className="text-gray-600">{achievement.description}</p>
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
        <div className="pt-28 pb-20 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                        Our Achievements
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
                    <div className="space-y-8 max-w-4xl mx-auto">
                        {filteredAchievements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(ach => (
                            <AchievementCard key={ach.id} achievement={ach} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsPage;
