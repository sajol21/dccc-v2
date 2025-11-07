import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Event } from '../types';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl border border-gray-200/80 overflow-hidden group flex flex-col shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <Link to={`/events/${event.id}`} className="block overflow-hidden aspect-[16/10]">
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
        </motion.div>
    );
};

const EventsPage: React.FC = () => {
    const { data: events, loading, error } = useData(getEvents);
    const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

    const filteredEvents = useMemo(() => {
        if (!events) return [];
        const sortedEvents = [...events].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let displayEvents = view === 'upcoming'
            ? sortedEvents.filter(e => e.isUpcoming).reverse() // Show nearest upcoming first
            : sortedEvents.filter(e => !e.isUpcoming);

        return displayEvents;
    }, [events, view]);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            Club Events
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover our vibrant lineup of upcoming and past cultural events.
                    </p>
                </motion.div>
                
                <div className="flex justify-center border-b border-gray-200 mb-12">
                    <button
                        onClick={() => setView('upcoming')}
                        className={`px-4 py-2 font-medium text-gray-500 relative transition-colors ${view === 'upcoming' ? 'text-blue-600' : 'hover:text-blue-600'}`}
                    >
                        Upcoming
                        {view === 'upcoming' && <motion.div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600" layoutId="active-event-tab" />}
                    </button>
                    <button
                        onClick={() => setView('past')}
                        className={`px-4 py-2 font-medium text-gray-500 relative transition-colors ${view === 'past' ? 'text-blue-600' : 'hover:text-blue-600'}`}
                    >
                        Past
                        {view === 'past' && <motion.div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600" layoutId="active-event-tab" />}
                    </button>
                </div>

                {loading && <Loader />}
                {error && <p className="text-center text-red-500">Failed to load events.</p>}

                {filteredEvents && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <AnimatePresence>
                            {filteredEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                 {!loading && filteredEvents.length === 0 && (
                     <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-16 text-gray-500">
                        <p className="text-xl">No {view} events to show right now.</p>
                        <p>Check back later for more updates!</p>
                     </motion.div>
                 )}
            </div>
        </div>
    );
};

export default EventsPage;