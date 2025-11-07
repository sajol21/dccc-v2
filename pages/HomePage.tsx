import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Section from '../components/Section';
import Loader from '../components/Loader';
import InteractiveMesh from '../components/InteractiveMesh';
import type { Department, Event, Achievement } from '../types';
import { useTheme } from '../components/ThemeProvider';

const StatCard: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="text-center p-4"
    >
        <p className="text-4xl md:text-5xl font-extrabold text-indigo-600">{value}</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium tracking-wide">{label}</p>
    </motion.div>
);

const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <Link to={`/departments/${department.id}`} className="block relative rounded-2xl overflow-hidden group shadow-lg aspect-w-4 aspect-h-5 bg-gray-100 dark:bg-gray-800">
        <img src={department.coverImage} alt={department.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors duration-300"></div>
        <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
            <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className="transform transition-transform duration-300 group-hover:-translate-y-2"
            >
                <div className="text-4xl mb-3">{department.iconUrl}</div>
                <h3 className="text-2xl font-bold mb-1">{department.name}</h3>
                <p className="text-sm opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-90 group-hover:mt-2 transition-all duration-300 ease-in-out">{department.shortDesc}</p>
            </motion.div>
        </div>
    </Link>
);

const TimelineEvent: React.FC<{ achievement: Achievement; isLeft: boolean }> = ({ achievement, isLeft }) => (
    <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className={`relative mb-12 flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
        <div className="hidden md:block w-5/12"></div>
        <div className="hidden md:block w-2/12">
            <div className="w-8 h-8 mx-auto bg-indigo-600 rounded-full border-4 border-white dark:border-gray-800 shadow-md"></div>
        </div>
        <div className="w-full md:w-5/12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 ml-8 md:ml-0">
                <p className="text-indigo-500 font-bold mb-1">{new Date(achievement.date).getFullYear()}</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{achievement.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{achievement.description}</p>
            </div>
        </div>
    </motion.div>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    return (
        <Link to={`/events/${event.id}`} className="block bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="h-48 overflow-hidden relative">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-center rounded-lg p-2 shadow-lg w-16">
                    <p className="text-3xl font-bold text-indigo-600">{day}</p>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{month}</p>
                </div>
            </div>
            <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.shortDescription}</p>
            </div>
        </Link>
    );
};


const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const { theme } = useTheme();

    const heroRef = useRef(null);
    const { scrollYProgress: scrollYProgressHero } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
    
    const parallaxYImageTransform = useTransform(scrollYProgressHero, [0, 1], ["0%", "15%"]);
    const parallaxYImage = useSpring(parallaxYImageTransform, springConfig);
    
    const joinRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: joinRef, offset: ["start end", "end start"] });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    // Mouse parallax logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfigMouse = { damping: 40, stiffness: 200, mass: 1 };
    const springMouseX = useSpring(mouseX, springConfigMouse);
    const springMouseY = useSpring(mouseY, springConfigMouse);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const { clientX, clientY } = event;
            const moveX = clientX - window.innerWidth / 2;
            const moveY = clientY - window.innerHeight / 2;
            mouseX.set(moveX);
            mouseY.set(moveY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    const parallaxXMouse = useTransform(springMouseX, [-window.innerWidth / 2, window.innerWidth / 2], ["-15px", "15px"]);
    const parallaxYMouse = useTransform(springMouseY, [-window.innerHeight / 2, window.innerHeight / 2], ["-15px", "15px"]);
    const parallaxXMouseForeground = useTransform(springMouseX, [-window.innerWidth / 2, window.innerWidth / 2], ["8px", "-8px"]);
    const parallaxYMouseForeground = useTransform(springMouseY, [-window.innerHeight / 2, window.innerHeight / 2], ["8px", "-8px"]);
    
    const meshColors = theme === 'dark' 
        ? { particleColor: 'rgba(156, 163, 175, 0.7)', lineColorRGB: '156, 163, 175' } // Tailwind gray-400
        : { particleColor: 'rgba(107, 114, 128, 0.8)', lineColorRGB: '107, 114, 128' }; // Tailwind gray-500

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    if (!appData) return null;

    const { about, departments, events, achievements, join } = appData;
    const upcomingEvents = events.filter(e => e.isUpcoming).slice(0, 3);
    const timelineAchievements = achievements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

    return (
        <div className="bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section ref={heroRef} className="relative flex items-center justify-center text-center py-12 overflow-hidden bg-gray-50 dark:bg-black" style={{ minHeight: 'calc(100vh - 4rem)' }}>
                 <motion.div
                    className="absolute inset-0 z-0 opacity-40 dark:opacity-60"
                    style={{ y: parallaxYImage }}
                >
                    <motion.div
                        className="w-full h-full"
                        style={{ x: parallaxXMouse, y: parallaxYMouse }}
                    >
                         <InteractiveMesh {...meshColors} />
                    </motion.div>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white dark:from-black/0 dark:via-black/0 dark:to-black z-0"></div>
                <div className="relative z-10 px-4 w-full max-w-4xl">
                    <motion.div
                        style={{ x: parallaxXMouseForeground, y: parallaxYMouseForeground }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-600 dark:text-gray-300 tracking-wide uppercase">Dhaka College</h2>
                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-gray-900 dark:text-white my-1 tracking-tighter leading-tight">
                            Cultural Club
                        </h1>
                        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mt-4 max-w-xl mx-auto">
                            Know Thyself, Show Thyself
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link
                                to="/team"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-red-500 rounded-full shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                            >
                                See Panel
                            </Link>
                            <a
                                href="https://dhakacollegeculturalclub.com/join"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-800 dark:text-white border-2 border-gray-800 dark:border-white/80 rounded-full hover:bg-gray-800/10 dark:hover:bg-white/10 transition-all duration-300"
                            >
                                Join DCCC
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Section id="about" title="About DCCC" subtitle={about.visionTagline} alternateBackground>
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
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{about.shortText}</p>
                        <div className="grid grid-cols-2 gap-6 text-center my-8">
                            {about.stats.slice(0, 2).map((stat, index) => <StatCard key={index} {...stat} index={index} />)}
                        </div>
                        <Link to="/about" className="px-6 py-3 rounded-full font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                            Learn Our Story
                        </Link>
                    </motion.div>
                </div>
            </Section>

            <Section id="departments" title="Our Departments" subtitle="Explore the diverse creative wings of our club.">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {departments.slice(0, 3).map((dept) => <DepartmentCard key={dept.id} department={dept} />)}
                </div>
                 <div className="text-center mt-12">
                    <Link to="/departments" className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg">
                        View All Departments
                    </Link>
                </div>
            </Section>

            <Section id="story" title="Our Story Timeline" subtitle="Tracing the footsteps of a cultural legacy." alternateBackground>
                <div className="relative max-w-2xl mx-auto py-8">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    {timelineAchievements.map((event, index) => <TimelineEvent key={event.id} achievement={event} isLeft={index % 2 === 0} />)}
                </div>
            </Section>

             <Section id="events" title="Upcoming Events" subtitle="Join us for our upcoming workshops, competitions, and performances.">
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
                </div>
                 <div className="text-center mt-12">
                    <Link to="/events" className="px-6 py-3 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                        See All Events
                    </Link>
                </div>
            </Section>

            <section ref={joinRef} className="relative py-28 overflow-hidden bg-gray-800 dark:bg-black text-white">
                <motion.div 
                    style={{ y: parallaxY }}
                    className="absolute inset-0 z-0"
                >
                    <img src={join.backgroundImageUrl} alt="Join us" className="w-full h-full object-cover opacity-20" />
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