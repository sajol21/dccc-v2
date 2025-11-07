import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import InteractiveMesh from '../components/InteractiveMesh';
import Section from '../components/Section';
import Loader from '../components/Loader';
import type { Department, Achievement, Event } from '../types';

const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <Link to={`/departments/${department.id}`} className="block aspect-[4/5] relative rounded-xl overflow-hidden group shadow-lg">
        <img src={department.coverImage} alt={department.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors"></div>
        <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
            <div className="text-4xl mb-3">{department.iconUrl}</div>
            <h3 className="text-2xl font-bold mb-1">{department.name}</h3>
            <p className="text-sm opacity-90">{department.shortDesc}</p>
        </div>
    </Link>
);


const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden group relative shadow-lg">
        <div className="overflow-hidden h-56">
             <img src={achievement.imageUrl} alt={achievement.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-5">
            <p className="text-xs text-blue-600 font-semibold mb-1">{new Date(achievement.date).getFullYear()} | {achievement.category}</p>
            <h4 className="font-bold text-lg text-gray-800 leading-tight">{achievement.title}</h4>
        </div>
    </div>
);

const EventCard: React.FC<{ event: Event; index: number }> = ({ event, index }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg overflow-hidden border border-gray-200 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
        >
            <Link to={`/events/${event.id}`} className="block">
                <div className="relative">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-600 rounded-md p-2 text-center leading-none shadow-md">
                        <span className="text-2xl font-bold">{day}</span>
                        <span className="text-xs font-semibold block uppercase">{month}</span>
                    </div>
                </div>
            </Link>
            <div className="p-6 flex-grow flex flex-col">
                 <h3 className="text-xl font-bold mb-2 text-gray-900">
                    <Link to={`/events/${event.id}`} className="hover:text-blue-600 transition-colors">{event.title}</Link>
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                    <span className="font-semibold">{event.time}</span> @ {event.location}
                </p>
                <p className="text-gray-600 mb-6 text-sm flex-grow">{event.shortDescription}</p>
                <Link 
                    to={`/events/${event.id}`}
                    className="mt-auto block w-full text-center px-4 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity duration-300"
                >
                    View Details
                </Link>
            </div>
        </motion.div>
    );
};


const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);

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
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-gray-900">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                        {hero.headline}
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
                <div className="absolute bottom-10 z-10 animate-bounce">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </div>
            </section>

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

            {/* About Section Preview */}
            <Section title="About Us" subtitle={about.visionTagline} alternateBackground>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <img src={about.imageUrl} alt="About DCCC" className="rounded-lg shadow-xl" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                        <p className="text-lg text-gray-600 mb-6">{about.shortText}</p>
                        <Link to="/about" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                            Read Our Story
                        </Link>
                    </motion.div>
                </div>
            </Section>

            {/* Departments Section Preview */}
            <Section title="Our Departments" subtitle="Explore the diverse creative wings of our club.">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

             {/* Achievements Section Preview */}
             <Section title="Our Achievements" subtitle="Celebrating milestones and accolades earned through dedication." alternateBackground>
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
                    <Link to="/achievements" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                        View All Achievements
                    </Link>
                </div>
            </Section>

            {/* Events Section Preview */}
            <Section title="Upcoming Events" subtitle="Join us for our upcoming workshops, competitions, and celebrations.">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.filter(e => e.isUpcoming).slice(0, 3).map((event, i) => (
                        <EventCard key={event.id} event={event} index={i} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/events" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                        View All Events
                    </Link>
                </div>
            </Section>

            {/* Join Us Section */}
            <div id="join" className="py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-2xl overflow-hidden text-center p-12 shadow-2xl">
                         <img src="https://picsum.photos/1200/400?random=99" alt="Join Us" className="absolute inset-0 w-full h-full object-cover" />
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