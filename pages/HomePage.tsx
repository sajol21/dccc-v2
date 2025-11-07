import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import InteractiveMesh from '../components/InteractiveMesh';
import Section from '../components/Section';
import Loader from '../components/Loader';
import type { Department, Achievement, Event } from '../types';

const SectionDivider: React.FC<{ flip?: boolean, className?: string }> = ({ flip = false, className = 'text-white' }) => (
    <div className={`absolute bottom-0 left-0 w-full overflow-hidden leading-none ${flip ? '' : 'transform rotate-180'}`} aria-hidden="true">
        <svg className={`relative block w-full h-[60px] md:h-[100px] ${className}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-current"></path>
        </svg>
    </div>
);

const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <Link to={`/departments/${department.id}`} className="block aspect-[4/5] relative rounded-xl overflow-hidden group shadow-lg">
        <img src={department.coverImage} alt={department.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-300"></div>
        <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
            <div className="text-4xl mb-3">{department.iconUrl}</div>
            <h3 className="text-2xl font-bold mb-1">{department.name}</h3>
            <p className="text-sm opacity-90">{department.shortDesc}</p>
        </div>
    </Link>
);


const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className="aspect-[4/5] bg-gray-900 rounded-xl overflow-hidden group relative shadow-lg">
        <img src={achievement.imageUrl} alt={achievement.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70 group-hover:opacity-90" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
        <div className="relative h-full flex flex-col justify-end p-5 text-white z-10">
            <p className="text-xs font-semibold uppercase text-blue-300 mb-1">{achievement.category}</p>
            <h4 className="font-bold text-lg text-white leading-tight">{achievement.title}</h4>
        </div>
    </div>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden group flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">
            <Link to={`/events/${event.id}`} className="block overflow-hidden aspect-[16/10]">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start gap-5 mb-4">
                    <div className="text-center flex-shrink-0 w-16">
                        <p className="text-3xl font-bold text-blue-600">{day}</p>
                        <p className="text-sm font-semibold text-gray-400">{month}</p>
                    </div>
                    <div className="pt-1">
                         <h3 className="font-bold text-lg text-gray-900 leading-tight">
                            <Link to={`/events/${event.id}`} className="hover:text-blue-600 transition-colors duration-200">{event.title}</Link>
                        </h3>
                    </div>
                </div>
                <p className="text-sm text-gray-600 flex-grow mb-6">{event.shortDescription}</p>
                <div className="mt-auto border-t border-gray-100 pt-4">
                     <Link to={`/events/${event.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors group-hover:text-blue-800 flex items-center gap-2">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const joinRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: joinRef,
        offset: ["start end", "end start"]
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    if (!appData) return null;

    const { hero, about, departments, achievements, events, join } = appData;

    return (
        <div>
            {/* Hero Section */}
            <section className="h-screen relative flex items-center justify-center text-center overflow-hidden">
                <InteractiveMesh />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-10 p-4"
                >
                    <h1 className="font-black tracking-tight mb-4 text-gray-900">
                        <span className="block text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                            {hero.headlineLine1}
                        </span>
                        <span className="block text-5xl md:text-8xl mt-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                            {hero.headlineLine2}
                        </span>
                    </h1>
                    <p className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-700">
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
                                className="px-8 py-3 rounded-md font-semibold text-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
                            >
                                {btn.text}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
                <div className="absolute bottom-10 z-10">
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center items-start p-1">
                        <motion.div
                            className="w-1 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>
                </div>
            </section>
            
            <div className="relative">
                 <SectionDivider flip className="text-gray-50"/>
                 {/* Stats Section */}
                <section className="bg-white py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            {about.stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.15 }}
                                >
                                    <p className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{stat.value}</p>
                                    <p className="text-gray-500 mt-2 font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            
            {/* About Section Preview */}
            <div className="relative bg-white">
                <SectionDivider className="text-white"/>
                <Section title="About Us" subtitle={about.visionTagline} alternateBackground>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <img src={about.imageUrl} alt="About DCCC" className="rounded-lg shadow-xl" loading="lazy" decoding="async" />
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <p className="text-lg text-gray-600 mb-6">{about.shortText}</p>
                            <Link to="/about" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                                Read Our Story
                            </Link>
                        </motion.div>
                    </div>
                </Section>
            </div>
            
            {/* Departments Section Preview */}
             <div className="relative">
                <SectionDivider flip className="text-gray-50" />
                <Section title="Our Departments" subtitle="Explore the diverse creative wings of our club.">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {departments.slice(0, 4).map((dept, i) => (
                            <motion.div
                                key={dept.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <DepartmentCard department={dept} />
                            </motion.div>
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/departments" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                            Explore All Departments
                        </Link>
                    </div>
                </Section>
            </div>

             {/* Achievements Section Preview */}
            <div className="relative bg-white">
                <SectionDivider className="text-white"/>
                 <Section title="Our Achievements" subtitle="Celebrating milestones and accolades earned through dedication." alternateBackground>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
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
                        <Link to="/achievements" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                            View All Achievements
                        </Link>
                    </div>
                </Section>
            </div>
            
            {/* Events Section Preview */}
            <div className="relative">
                <SectionDivider flip className="text-gray-50" />
                <Section title="Upcoming Events" subtitle="Join us for our upcoming workshops, competitions, and celebrations.">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.filter(e => e.isUpcoming).slice(0, 3).map((event, i) => (
                             <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <EventCard event={event} />
                             </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/events" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                            View All Events
                        </Link>
                    </div>
                </Section>
            </div>
            
            {/* Join Us Section */}
            <div ref={joinRef} id="join" className="py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-2xl overflow-hidden text-center p-12 shadow-2xl">
                         <motion.img 
                            src="https://picsum.photos/1200/400?random=99" 
                            alt="Join Us" 
                            className="absolute top-0 left-0 w-full h-[140%] object-cover" 
                            style={{ y: parallaxY }}
                            loading="lazy" 
                            decoding="async" 
                        />
                         <div className="absolute inset-0 bg-blue-800/70 backdrop-blur-sm"></div>
                         <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">{join.title}</h2>
                            <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">{join.description}</p>
                            <a href={join.buttonLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-block px-10 py-4 rounded-lg font-bold text-lg text-blue-700 bg-white hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                {join.buttonText}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;