import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Event } from '../types';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const date = new Date(event.date);
    const day = date.toLocaleDateString('en-US', { day: '2-digit' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });

    const generateCalendarLink = () => {
        if (!event.startTime24) return '#';
    
        const startDateTime = new Date(`${event.date}T${event.startTime24}:00`);
        if (isNaN(startDateTime.getTime())) return '#';
    
        const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
    
        const formatGCDate = (date: Date) => date.toISOString().replace(/-|:|\.\d{3}Z/g, '');
    
        const link = new URL('https://www.google.com/calendar/render');
        link.searchParams.append('action', 'TEMPLATE');
        link.searchParams.append('text', event.title);
        link.searchParams.append('dates', `${formatGCDate(startDateTime)}/${formatGCDate(endDateTime)}`);
        link.searchParams.append('details', event.shortDescription);
        link.searchParams.append('location', event.location);
        return link.href;
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-lg overflow-hidden border border-gray-200 group hover:shadow-xl transition-all duration-300 flex flex-col"
        >
            <Link to={`/events/${event.id}`} className="block">
                <div className="relative overflow-hidden">
                    <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-blue-600 rounded-md p-2 text-center leading-none shadow-md">
                        <span className="text-2xl font-bold">{day}</span>
                        <span className="text-xs font-semibold block uppercase">{month}</span>
                    </div>
                     <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">{event.category}</div>
                </div>
            </Link>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                    <Link to={`/events/${event.id}`} className="hover:text-blue-600 transition-colors">{event.title}</Link>
                </h3>
                <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.location}
                </p>
                <p className="text-gray-600 mb-6 text-sm flex-grow">{event.shortDescription}</p>
                
                <div className="mt-auto grid grid-cols-2 gap-2 text-sm">
                    <Link to={`/events/${event.id}`} className="w-full text-center px-4 py-2 rounded-md font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors duration-300">
                        View Details
                    </Link>
                    {event.isUpcoming && event.startTime24 ? (
                        <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer" className="w-full text-center px-4 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
                            Add to Calendar
                        </a>
                    ) : (
                         <span className="w-full text-center px-4 py-2 rounded-md font-semibold text-gray-500 bg-gray-100 cursor-not-allowed">
                            {event.isUpcoming ? 'Details TBD' : 'Event Finished'}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const EventsPage: React.FC = () => {
    const { data: events, loading, error } = useData(getEvents);
    const [view, setView] = useState<'upcoming' | 'past'>('upcoming');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        if (!events) return [];
        const eventSet = view === 'upcoming' 
            ? events.filter(e => e.isUpcoming) 
            : events.filter(e => !e.isUpcoming);
        return ['All', ...Array.from(new Set(eventSet.map(e => e.category)))];
    }, [events, view]);
    
    const filteredEvents = useMemo(() => {
        if (!events) return [];
        const sortedEvents = [...events].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let displayEvents = view === 'upcoming'
            ? sortedEvents.filter(e => e.isUpcoming)
            : sortedEvents.filter(e => !e.isUpcoming);

        if (selectedCategory !== 'All') {
            displayEvents = displayEvents.filter(e => e.category === selectedCategory);
        }

        return displayEvents;
    }, [events, view, selectedCategory]);

    // Reset category filter when switching between upcoming/past
    const handleViewChange = (newView: 'upcoming' | 'past') => {
        setView(newView);
        setSelectedCategory('All');
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
                        Club Events
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover our vibrant lineup of upcoming and past cultural events.
                    </p>
                </motion.div>
                
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        onClick={() => handleViewChange('upcoming')}
                        className={`px-6 py-2 text-md font-semibold rounded-full transition-all duration-300 ${
                            view === 'upcoming' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => handleViewChange('past')}
                        className={`px-6 py-2 text-md font-semibold rounded-full transition-all duration-300 ${
                            view === 'past' 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                    >
                        Past
                    </button>
                </div>

                <div className="flex justify-center flex-wrap gap-2 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 ${
                                selectedCategory === category 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading && <Loader />}
                {error && <p className="text-center text-red-500">Failed to load events.</p>}

                {filteredEvents && (
                    <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </motion.div>
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