
import React from 'react';
import { motion } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';

const AboutPage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const aboutData = appData?.about;

    if (loading) return <div className="h-screen flex items-center justify-center pt-20"><Loader /></div>;
    if (error || !aboutData) return <div className="text-center py-40 text-red-500">Could not load about page.</div>;
    
    return (
        <div className="pt-20 bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        Our Story
                    </h1>
                    <p className="mt-4 text-xl md:text-2xl text-gray-300">{aboutData.visionTagline}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 max-w-5xl mx-auto"
                >
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl shadow-black/50">
                        <img src={aboutData.imageUrl} alt="Dhaka College Cultural Club" className="w-full h-full object-cover"/>
                    </div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="bg-gray-800 p-6 rounded-lg">
                        <div className="text-4xl font-bold text-teal-400">{aboutData.foundedYear}</div>
                        <p className="text-gray-400 mt-2">Founded</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.7 }} className="bg-gray-800 p-6 rounded-lg">
                        <div className="text-4xl font-bold text-teal-400">{new Date().getFullYear() - aboutData.foundedYear}+</div>
                        <p className="text-gray-400 mt-2">Years of Legacy</p>
                    </motion.div>
                     <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.9 }} className="bg-gray-800 p-6 rounded-lg">
                        <div className="text-4xl font-bold text-teal-400">1000+</div>
                        <p className="text-gray-400 mt-2">Active Members</p>
                    </motion.div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="mt-16 max-w-3xl mx-auto prose prose-invert lg:prose-xl text-gray-300 leading-relaxed"
                >
                    <p>{aboutData.fullText}</p>
                </motion.div>

                {aboutData.videoUrl && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mt-20 max-w-5xl mx-auto"
                    >
                         <h2 className="text-3xl font-bold text-center mb-8">Glimpses of Our Journey</h2>
                         <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl shadow-black/50">
                            <video src={aboutData.videoUrl} controls className="w-full h-full object-cover"></video>
                         </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AboutPage;
