
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
// FIX: Import AnimatePresence from framer-motion.
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Section from '../components/Section';
import Loader from '../components/Loader';
import InteractiveMesh from '../components/InteractiveMesh';
import type { Department, Event } from '../types';


const StatCard: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="text-center p-4"
    >
        <p className="text-4xl md:text-5xl font-extrabold text-indigo-600">{value}</p>
        <p className="text-gray-500 mt-2 font-medium tracking-wide">{label}</p>
    </motion.div>
);

const EventListItem: React.FC<{ event: Event }> = ({ event }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <Link to={`/events/${event.id}`} className="block p-5 rounded-lg hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-6">
                    <div className="text-center flex-shrink-0 w-16 bg-white border border-gray-200 rounded-lg py-2">
                        <p className="text-3xl font-bold text-indigo-600">{day}</p>
                        <p className="text-sm font-semibold text-gray-400">{month}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1 group-hover:text-indigo-600">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.shortDescription}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};


const JourneyMilestone: React.FC<{ year: string; title: string; desc: string; icon: string; isLast?: boolean }> = ({ year, title, desc, icon, isLast = false }) => (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="flex gap-6 relative"
    >
        <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white z-10">
                {icon}
            </div>
            {!isLast && <div className="w-0.5 flex-grow bg-gray-300"></div>}
        </div>
        <div>
            <p className="text-indigo-500 font-bold mb-1">{year}</p>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
            <p className="text-gray-600 text-sm">{desc}</p>
        </div>
    </motion.div>
);


const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const [activeDept, setActiveDept] = useState<Department | null>(null);

    const joinRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: joinRef, offset: ["start end", "end start"] });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    if (!appData) return null;

    const { about, departments, events, join } = appData;
    const upcomingEvents = events.filter(e => e.isUpcoming).slice(0, 3);
    const timelineEvents = [
        { year: "2021", title: "The Beginning", description: "DCCC was founded with a vision to create a vibrant platform for students to explore and showcase their artistic talents after the pandemic.", icon: "🚀" },
        { year: "2022", title: "First Major Event", description: "Hosted its first inter-college cultural festival, 'Summer Art Camp 2022', setting a new benchmark for excellence.", icon: "🎉" },
        { year: "2023", title: "Expanding Horizons", description: "The club expanded its wings, introducing new leadership and hosting a series of workshops that enriched the cultural scene.", icon: "🌟" },
        { year: "Present", title: "A Legacy of Creativity", description: "Today, DCCC stands as a beacon of cultural excellence, nurturing hundreds of students and continuing its mission to inspire.", icon: "🏆", isLast: true },
    ];

    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="relative flex items-center justify-center text-center h-screen overflow-hidden">
                <InteractiveMesh />
                <div className="relative z-10 px-4 w-full max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-600 tracking-wide uppercase">Dhaka College</h2>
                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-gray-800 my-1 tracking-tighter leading-tight">
                            Cultural Club
                        </h1>
                        <p className="text-base md:text-lg text-gray-500 mt-4 max-w-xl mx-auto">
                            Know Thyself, Show Thyself
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link
                                to="/panel"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-red-500 rounded-full shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                            >
                                See Panel
                            </Link>
                            <a
                                href="https://dhakacollegeculturalclub.com/join"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-700 border-2 border-gray-400/80 rounded-full hover:bg-gray-400/20 transition-all duration-300"
                            >
                                Join DCCC
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Section id="about" title="Who We Are" subtitle={about.visionTagline} alternateBackground>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <img src={about.imageUrl} alt="About DCCC" className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]" loading="lazy" decoding="async" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{about.shortText}</p>
                        <div className="grid grid-cols-2 gap-6 text-center my-8">
                            {about.stats.slice(0, 2).map((stat, index) => <StatCard key={index} {...stat} index={index} />)}
                        </div>
                        <Link to="/about" className="px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                            Learn Our Story
                        </Link>
                    </motion.div>
                </div>
            </Section>

            <Section id="departments" title="What We Do" subtitle="Explore the diverse creative wings of our club.">
                <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                        className="space-y-2"
                    >
                        {departments.slice(0, 6).map(dept => (
                            <div 
                                key={dept.id} 
                                onMouseEnter={() => setActiveDept(dept)}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${activeDept?.id === dept.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
                            >
                                <h3 className="text-xl font-bold text-gray-800">{dept.name}</h3>
                            </div>
                        ))}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7 }}
                        className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg bg-gray-200"
                    >
                        <AnimatePresence>
                            <motion.img 
                                key={activeDept ? activeDept.id : 'default'}
                                src={activeDept ? activeDept.coverImage : (departments[0]?.coverImage || '')}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                            <h3 className="text-2xl font-bold mb-1">{activeDept ? activeDept.name : departments[0]?.name}</h3>
                            <p className="text-sm opacity-90">{activeDept ? activeDept.shortDesc : departments[0]?.shortDesc}</p>
                        </div>
                    </motion.div>
                </div>
                <div className="text-center mt-12">
                    <Link to="/departments" className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg">
                        View All Departments
                    </Link>
                </div>
            </Section>

            <Section id="events" title="Upcoming Events" subtitle="Join us for our upcoming workshops, competitions, and performances." alternateBackground>
                 <div className="max-w-3xl mx-auto space-y-4">
                    {upcomingEvents.map(event => <EventListItem key={event.id} event={event} />)}
                </div>
                 <div className="text-center mt-12">
                    <Link to="/events" className="px-6 py-3 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                        See All Events
                    </Link>
                </div>
            </Section>

            <Section id="story" title="Our Journey" subtitle="Tracing the footsteps of a cultural legacy.">
                <div className="max-w-xl mx-auto">
                    {timelineEvents.map((event, index) => <JourneyMilestone key={index} {...event} />)}
                </div>
            </Section>

            <section ref={joinRef} className="relative py-28 overflow-hidden bg-gray-800 text-white">
                <motion.div 
                    style={{ y: parallaxY }}
                    className="absolute inset-0 z-0"
                >
                    <img src={join.backgroundImageUrl} alt="Join us" className="w-full h-full object-cover opacity-30" />
                </motion.div>
                <div className="relative z-10 container mx-auto text-center px-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{join.title}</h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{join.description}</p>
                    <a 
                        href={join.buttonLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 transition-all duration-300 transform hover:scale-110 shadow-2xl"
                    >
                        {join.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
