

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import InteractiveMesh from '../components/InteractiveMesh';
import Section from '../components/Section';
import Loader from '../components/Loader';
import type { Department, Event, Executive } from '../types';

const StatCard: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: index * 0.15 }}
        className="text-center p-4"
    >
        <p className="text-4xl md:text-5xl font-extrabold text-blue-600">{value}</p>
        <p className="text-gray-500 mt-2 font-medium tracking-wide">{label}</p>
    </motion.div>
);

const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <Link to={`/departments/${department.id}`} className="block relative rounded-2xl overflow-hidden group shadow-lg aspect-w-4 aspect-h-5 bg-gray-100">
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

const TimelineEvent: React.FC<{ year: string; title: string; desc: string; isLeft: boolean }> = ({ year, title, desc, isLeft }) => (
    <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className={`relative mb-12 flex items-center ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
        <div className="hidden md:block w-5/12"></div>
        <div className="hidden md:block w-2/12">
            <div className="w-8 h-8 mx-auto bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
        </div>
        <div className="w-full md:w-5/12">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 ml-8 md:ml-0">
                <p className="text-blue-600 font-bold mb-1">{year}</p>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
                <p className="text-gray-600 text-sm">{desc}</p>
            </div>
        </div>
    </motion.div>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    return (
        <Link to={`/events/${event.id}`} className="block bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="h-48 overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex items-start gap-5">
                 <div className="text-center flex-shrink-0 w-16">
                    <p className="text-3xl font-bold text-blue-600">{day}</p>
                    <p className="text-sm font-semibold text-gray-400">{month}</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.shortDescription}</p>
                </div>
            </div>
        </Link>
    );
};


const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const joinRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: joinRef, offset: ["start end", "end start"] });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error) return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    if (!appData) return null;

    const { hero, about, departments, events, join } = appData;
    const upcomingEvents = events.filter(e => e.isUpcoming).slice(0, 3);
    const timelineEvents = [
        { year: "2021", title: "The Beginning", description: "DCCC was founded with a vision to create a vibrant platform for students to explore and showcase their artistic talents after the pandemic." },
        { year: "2022", title: "First Major Event", description: "Hosted its first inter-college cultural festival, 'Summer Art Camp 2022', setting a new benchmark for excellence and collaboration." },
        { year: "2023", title: "Expanding Horizons", description: "The club expanded its wings, introducing new leadership and hosting a series of workshops that enriched the cultural scene in Dhaka." },
        { year: "Present", title: "A Legacy of Creativity", description: "Today, DCCC stands as a beacon of cultural excellence, nurturing hundreds of students and continuing its mission to inspire and innovate." },
    ];

    const heroVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.4 },
        },
    };

    const heroItemVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: 'easeOut' } },
    };


    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <section className="h-screen relative flex items-center justify-center text-center overflow-hidden">
                <InteractiveMesh />
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <motion.div 
                        className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
                        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -50, 0] }}
                        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    />
                    <motion.div 
                        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
                        animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, 50, 0] }}
                        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2 }}
                    />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={heroVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative z-10 p-4"
                    >
                        <motion.h1 variants={heroItemVariants} className="font-black tracking-tight mb-4">
                            <span className="block text-3xl md:text-4xl font-bold text-gray-800">
                                {hero.headlineLine1}
                            </span>
                            <span className="block text-5xl md:text-8xl mt-1 text-gray-900">
                                {hero.headlineLine2}
                            </span>
                        </motion.h1>
                        <motion.p variants={heroItemVariants} className="text-lg md:text-2xl max-w-3xl mx-auto text-gray-700">
                            {hero.tagline}
                        </motion.p>
                        <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap justify-center gap-4">
                            {hero.ctaButtons.map((button, index) => (
                               <Link
                                    key={index}
                                    to={button.link}
                                    className="px-8 py-3 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30"
                                >
                                    {button.text}
                                </Link>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
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

            {/* Mission & Stats Section */}
            <Section title="Our Mission" subtitle={about.shortText}>
                <div className="max-w-4xl mx-auto">
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {about.stats.map((stat, index) => (
                           <StatCard key={stat.label} value={stat.value} label={stat.label} index={index} />
                        ))}
                    </div>
                </div>
            </Section>

            {/* Departments Section */}
            <Section title="Our Departments" subtitle="Explore the diverse creative wings of our club." alternateBackground>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {departments.slice(0, 4).map((dept, i) => (
                        <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <DepartmentCard department={dept} />
                        </motion.div>
                    ))}
                </div>
                 <div className="text-center mt-12">
                    <Link to="/departments" className="px-8 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                        Explore All Departments
                    </Link>
                </div>
            </Section>

            {/* Journey Timeline Section */}
            <Section title="Our Journey" subtitle="Tracing the footsteps of a cultural legacy.">
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-4 md:left-1/2 top-0 h-full w-0.5 bg-gray-200"></div>
                    {timelineEvents.map((event, index) => (
                        <TimelineEvent key={index} {...event} isLeft={index % 2 === 0} />
                    ))}
                </div>
            </Section>

            {/* Upcoming Events Section */}
            <Section title="Upcoming Events" subtitle="Join us for our upcoming workshops, competitions, and celebrations." alternateBackground>
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    )) : (
                        <p className="text-center text-gray-600 md:col-span-2">No upcoming events scheduled. Check back soon!</p>
                    )}
                </div>
                <div className="text-center mt-12">
                    <Link to="/events" className="px-8 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                        View All Events
                    </Link>
                </div>
            </Section>


            {/* Join Us Section */}
            <div ref={joinRef} id="join" className="py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-2xl overflow-hidden text-center p-12 shadow-2xl">
                         <motion.img 
                            src={join.backgroundImageUrl}
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