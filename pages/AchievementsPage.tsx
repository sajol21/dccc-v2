import React, { useEffect, useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import Section from '../components/Section';
import type { Person } from '../types';

const AnimatedStat: React.FC<{ value: string; label: string }> = ({ value, label }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = parseInt(value.replace('+', ''), 10);
    const spring = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        if (isInView) {
            spring.set(numericValue);
        }
    }, [isInView, numericValue, spring]);

    useEffect(() => {
        spring.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toString();
            }
        });
    }, [spring]);

    return (
        <div>
            <p className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                <span ref={ref}>0</span>{value.includes('+') && '+'}
            </p>
            <p className="text-gray-500 mt-2 font-medium">{label}</p>
        </div>
    );
};

const LeaderPreviewCard: React.FC<{ person: Person }> = ({ person }) => (
    <Link to="/panel" className="block group">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
        </div>
        <h4 className="font-bold mt-3 text-gray-800">{person.name}</h4>
        <p className="text-sm text-blue-600">{person.position}</p>
    </Link>
);


const AchievementsPage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);

    if (loading) return <div className="h-screen flex items-center justify-center pt-20 bg-white"><Loader /></div>;
    if (error || !appData) return <div className="text-center py-40 text-red-500">Could not load page data.</div>;

    const { about, leaders } = appData;
    
    const timelineEvents = [
        { year: "1956", title: "The Genesis", description: "Dhaka College Cultural Club was founded with a vision to create a vibrant platform for students to explore and showcase their artistic talents." },
        { year: "1990s", title: "A Decade of Growth", description: "The club expanded its wings, introducing new departments and hosting its first inter-college cultural festival, setting a new benchmark for excellence." },
        { year: "2010s", title: "Embracing Modernity", description: "DCCC stepped into the digital age, launching its first website and social media presence, connecting with a wider audience than ever before." },
        { year: "Present", title: "A Legacy of Creativity", description: "Today, DCCC stands as a beacon of cultural excellence, nurturing thousands of students and continuing its mission to inspire and innovate." },
    ];

    return (
        <div className="bg-white text-gray-800">
            {/* Video Hero */}
            <header className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={about.videoUrl}
                    className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
                />
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-20 p-4"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">Our Journey & Legacy</h1>
                    <p className="text-lg md:text-2xl max-w-3xl mx-auto opacity-90">{about.visionTagline}</p>
                </motion.div>
            </header>

            {/* Stats Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {about.stats.map((stat) => (
                           <AnimatedStat key={stat.label} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Our Journey Timeline */}
            <Section title="Our Journey" subtitle="Tracing the footsteps of a cultural legacy.">
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 -translate-x-1/2"></div>
                    {timelineEvents.map((event, index) => (
                         <motion.div 
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                            className={`relative mb-12 flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                         >
                            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                                    <p className="text-blue-600 font-bold mb-1">{event.year}</p>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                                    <p className="text-gray-600">{event.description}</p>
                                </div>
                            </div>
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Leaders Preview */}
            <Section title="Meet the Leaders" subtitle="The passionate individuals guiding our creative journey." alternateBackground>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                    <LeaderPreviewCard person={leaders.moderators[0]} />
                    {leaders.currentExecutives.slice(0, 3).map(exec => (
                        <LeaderPreviewCard key={exec.id} person={exec} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/panel" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300">
                        View Full Panel
                    </Link>
                </div>
            </Section>

        </div>
    );
};

export default AchievementsPage;