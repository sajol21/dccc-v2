import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAchievements } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Achievement } from '../types';

const AchievementDetailModal: React.FC<{ achievement: Achievement, onClose: () => void }> = ({ achievement, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: -30 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden"
            >
                <div className="h-64 md:h-80 bg-gray-200">
                    <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 md:p-8">
                    <p className="text-sm font-semibold text-blue-600 mb-1">{achievement.category} &bull; {new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{achievement.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{achievement.description}</p>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors z-10">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </motion.div>
        </motion.div>
    );
};

const AchievementCard: React.FC<{ achievement: Achievement; onClick: () => void }> = ({ achievement, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onClick}
            className="aspect-[4/5] bg-gray-900 rounded-xl overflow-hidden group cursor-pointer relative shadow-lg"
        >
            <img src={achievement.imageUrl} alt={achievement.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
            <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
                <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                <p className="text-xs font-semibold uppercase text-blue-300">{new Date(achievement.date).getFullYear()} &bull; {achievement.category}</p>
            </div>
        </motion.div>
    );
};

const AchievementsPage: React.FC = () => {
    const { data: achievements, loading, error } = useData(getAchievements);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
             <AnimatePresence>
                {selectedAchievement && <AchievementDetailModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />}
            </AnimatePresence>
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
                
                {loading && <Loader />}
                {error && <p className="text-center text-red-500">Failed to load achievements.</p>}

                {achievements && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {achievements
                            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map(ach => (
                                <AchievementCard 
                                    key={ach.id} 
                                    achievement={ach} 
                                    onClick={() => setSelectedAchievement(ach)} 
                                />
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    );
};

export default AchievementsPage;