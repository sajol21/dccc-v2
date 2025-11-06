
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import InteractiveMesh from '../components/InteractiveMesh';
import Section from '../components/Section';
import Loader from '../components/Loader';
import type { Department, Achievement } from '../types';

// Smaller components defined outside to avoid re-creation on render
const DepartmentCard: React.FC<{ department: Department; index: number }> = ({ department, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 text-center border border-gray-700 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20"
    >
        <div className="text-5xl mb-4">{department.iconUrl}</div>
        <h3 className="text-xl font-bold mb-2">{department.name}</h3>
        <p className="text-gray-400 mb-4">{department.shortDesc}</p>
        <Link to={`/departments/${department.id}`} className="text-teal-400 hover:text-teal-300 font-semibold">Learn More &rarr;</Link>
    </motion.div>
);

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden group">
        <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="p-4">
            <p className="text-sm text-gray-400 mb-1">{new Date(achievement.date).getFullYear()} | {achievement.category}</p>
            <h4 className="font-bold text-lg">{achievement.title}</h4>
        </div>
    </div>
);


const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    if (!appData) return null;

    const { hero, about, departments, achievements, join } = appData;

    return (
        <div>
            {/* Hero Section */}
            <section className="h-screen relative flex items-center justify-center text-center text-white overflow-hidden">
                <InteractiveMesh />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-10 p-4"
                >
                    <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4" style={{ textShadow: '0 0 20px rgba(0,0,0,0.7)' }}>
                        {hero.headline}
                    </h1>
                    <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-200" style={{ textShadow: '0 0 10px rgba(0,0,0,0.7)' }}>
                        {hero.tagline}
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        {hero.ctaButtons.map((btn, i) => (
                            <motion.a
                                key={btn.text}
                                href={btn.link}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1 + i * 0.2 }}
                                className="px-8 py-3 rounded-md font-semibold text-lg bg-teal-500 hover:bg-teal-600 transition-all duration-300 transform hover:scale-105"
                            >
                                {btn.text}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
                <div className="absolute bottom-10 z-10 animate-bounce">
                    <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </section>

            {/* About Section Preview */}
            <Section title="About Us" subtitle={about.visionTagline}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <img src={about.imageUrl} alt="About DCCC" className="rounded-lg shadow-2xl shadow-black/30" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <p className="text-lg text-gray-300 mb-6">{about.shortText}</p>
                        <Link to="/about" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition-all duration-300">
                            Read Our Story
                        </Link>
                    </motion.div>
                </div>
            </Section>

            {/* Departments Section Preview */}
            <Section title="Our Departments" subtitle="Explore the diverse creative wings of our club.">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {departments.slice(0, 4).map((dept, i) => (
                        <DepartmentCard key={dept.id} department={dept} index={i} />
                    ))}
                </div>
            </Section>

             {/* Achievements Section Preview */}
             <Section title="Our Achievements" subtitle="Celebrating milestones and accolades earned through dedication.">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {achievements.slice(0, 4).map((ach, i) => (
                         <motion.div
                            key={ach.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                         >
                            <AchievementCard achievement={ach} />
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/achievements" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 transition-all duration-300">
                        View All Achievements
                    </Link>
                </div>
            </Section>

            {/* Join Us Section */}
            <section id="join" className="py-20 md:py-28 bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">{join.title}</h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">{join.description}</p>
                        <a href={join.buttonLink} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 rounded-lg font-bold text-lg text-white bg-teal-500 hover:bg-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-teal-500/30">
                            {join.buttonText}
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
