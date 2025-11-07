
import React from 'react';
import { motion } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';

const MotivePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const motiveData = appData?.motive;

    if (loading) return <div className="h-screen flex items-center justify-center pt-20 bg-white"><Loader /></div>;
    if (error || !motiveData) return <div className="text-center py-40 text-red-500">Could not load motive page.</div>;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' }},
    };

    return (
        <div className="pt-28 pb-20 min-h-screen flex items-center bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                        {motiveData.title}
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        Our guiding principles and aspirations for the future of art and culture.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto space-y-6"
                >
                    {motiveData.points.map((point, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex items-start md:items-center gap-6 bg-gray-100 p-6 rounded-lg border border-gray-200"
                        >
                            <div className="text-4xl md:text-5xl">{point.iconUrl}</div>
                            <p className="text-lg md:text-xl text-gray-700 flex-1">{point.text}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default MotivePage;