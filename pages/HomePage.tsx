import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Section from '../components/Section';
import Loader from '../components/Loader';
import type { Department, Event, Achievement } from '../types';

// --- Interactive Hero Component (Integrated from InteractiveMesh.tsx) ---

const particleEmojis = ['🎨', '🎵', '💻', '🎭', '✍️', '📈', '👥', '🎬', '💃', '🎶'];
interface Particle {
    x: number; y: number; originX: number; originY: number;
    vx: number; vy: number; size: number; char: string;
    forceX: number; forceY: number;
}

const InteractiveMeshHero: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000, radius: 150 };
        const springFactor = 0.02;
        const damping = 0.85;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };
        const handleMouseLeave = () => { mouse.x = -1000; mouse.y = -1000; };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        const init = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles.length = 0;
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 30000);

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 12 + 12;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push({
                    x, y, originX: x, originY: y, vx: 0, vy: 0, size,
                    char: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
                    forceX: 0, forceY: 0,
                });
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connect();

            particles.forEach(p => {
                const dxMouse = p.x - mouse.x;
                const dyMouse = p.y - mouse.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                let repelForce = 0;
                if (distMouse < mouse.radius) {
                    repelForce = (mouse.radius - distMouse) / mouse.radius;
                }

                p.forceX = (p.originX - p.x) * springFactor;
                p.forceY = (p.originY - p.y) * springFactor;
                
                if (repelForce > 0) {
                    p.forceX += (dxMouse / distMouse) * repelForce * 1.5;
                    p.forceY += (dyMouse / distMouse) * repelForce * 1.5;
                }

                p.vx = (p.vx + p.forceX) * damping;
                p.vy = (p.vy + p.forceY) * damping;

                p.x += p.vx; p.y += p.vy;

                ctx.font = `${p.size}px sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.char, p.x, p.y);
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        
        const connect = () => {
            if (!ctx) return;
            const connectDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectDistance) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        init();
        animate();
        window.addEventListener('resize', init);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', init);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <header className="relative flex items-center justify-center text-center overflow-hidden bg-gray-900" style={{ minHeight: '100vh' }}>
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-50" />
            <div className="relative z-10 px-4 w-full max-w-4xl text-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
                        Dhaka College<br/>Cultural Club
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-xl mx-auto font-medium">
                        Know Thyself, Show Thyself
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/about" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-red-500 rounded-full shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all duration-300 transform hover:scale-105">
                            Our Story
                        </Link>
                        <Link to="/events" className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white border-2 border-white/80 rounded-full hover:bg-white/10 transition-all duration-300">
                            Upcoming Events
                        </Link>
                    </div>
                </motion.div>
            </div>
        </header>
    );
};

// --- Sub-components for HomePage ---

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

const WhatWeDo: React.FC<{ departments: Department[] }> = ({ departments }) => {
    const [activeDept, setActiveDept] = useState<Department | null>(departments[0] || null);

    return (
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            <div className="flex flex-col gap-4">
                {departments.map((dept) => (
                    <motion.div
                        key={dept.id}
                        onHoverStart={() => setActiveDept(dept)}
                        className={`p-4 rounded-lg cursor-pointer transition-colors duration-300 ${activeDept?.id === dept.id ? 'bg-indigo-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-4">
                            <span className="text-3xl">{dept.iconUrl}</span>
                            <span>{dept.name}</span>
                        </h3>
                    </motion.div>
                ))}
            </div>
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-800">
                <AnimatePresence>
                    {activeDept && (
                        <motion.div
                            key={activeDept.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img src={activeDept.coverImage} alt={activeDept.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h4 className="text-2xl font-bold">{activeDept.name}</h4>
                                <p className="mt-2 text-sm">{activeDept.shortDesc}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const TimelineEvent: React.FC<{ achievement: Achievement; isLeft: boolean }> = ({ achievement, isLeft }) => (
    <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className={`relative mb-12 flex items-center w-full ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
        <div className="hidden md:block w-5/12"></div>
        <div className="hidden md:block w-2/12">
            <div className="w-8 h-8 mx-auto bg-indigo-600 rounded-full border-4 border-gray-50 dark:border-gray-900 shadow-md"></div>
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
        <Link to={`/events/${event.id}`} className="block bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="h-48 overflow-hidden">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
                <div className="flex gap-4 items-start">
                    <div className="text-center flex-shrink-0">
                        <p className="text-3xl font-bold text-indigo-600">{day}</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{month}</p>
                    </div>
                    <div>
                         <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-2">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{event.shortDescription}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// --- Main HomePage Component ---

const HomePage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    
    const joinRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: joinRef, offset: ["start end", "end start"] });
    const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

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
            <InteractiveMeshHero />

            <Section id="about" title="Who We Are" subtitle={about.visionTagline}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
                        <img src={about.imageUrl} alt="About DCCC" className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]" loading="lazy" decoding="async" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
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

            <Section id="departments" title="What We Do" subtitle="Explore the diverse creative wings of our club." alternateBackground>
                {departments.length > 0 ? <WhatWeDo departments={departments} /> : <p className="text-center">Departments coming soon!</p>}
                <div className="text-center mt-12">
                    <Link to="/departments" className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg">
                        View All Departments
                    </Link>
                </div>
            </Section>

            <Section id="story" title="Our Journey" subtitle="Tracing the footsteps of a cultural legacy.">
                <div className="relative max-w-2xl mx-auto py-8">
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    {timelineAchievements.map((event, index) => <TimelineEvent key={event.id} achievement={event} isLeft={index % 2 === 0} />)}
                </div>
            </Section>

             <Section id="events" title="Upcoming Events" subtitle="Join us for our upcoming workshops, competitions, and performances." alternateBackground>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {upcomingEvents.length > 0 ? upcomingEvents.map(event => <EventCard key={event.id} event={event} />) : <p className="text-center col-span-full">No upcoming events right now.</p>}
                </div>
                 <div className="text-center mt-12">
                    <Link to="/events" className="px-6 py-3 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-md">
                        See All Events
                    </Link>
                </div>
            </Section>

            <section ref={joinRef} className="relative py-28 overflow-hidden bg-gray-800 dark:bg-black text-white">
                <motion.div style={{ y: parallaxY }} className="absolute inset-0 z-0">
                    <img src={join.backgroundImageUrl} alt="Join us" className="w-full h-full object-cover opacity-20" />
                </motion.div>
                <div className="relative z-10 container mx-auto text-center px-4">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{join.title}</h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{join.description}</p>
                    <a href={join.buttonLink} target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 rounded-full font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90 transition-all duration-300 transform hover:scale-110 shadow-2xl">
                        {join.buttonText}
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
