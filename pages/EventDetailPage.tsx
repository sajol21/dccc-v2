import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventById } from '../services/firebaseService';
import Loader from '../components/Loader';
import type { Event } from '../types';

const Icon: React.FC<{ name: string; className?: string }> = ({ name, className = "w-5 h-5" }) => {
    const icons: { [key: string]: string } = {
        list: "M4 6h16M4 10h16M4 14h16M4 18h16",
        map: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
    };
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[name] || ''} />
        </svg>
    )
}

const SegmentAccordion: React.FC<{ segments: Event['segments'] }> = ({ segments }) => {
    const [expandedSegment, setExpandedSegment] = useState<string | null>(segments?.[0]?.title ?? null);

    return (
        <div className="space-y-1">
            {segments?.map(segment => (
                <div key={segment.title} className="border-b border-gray-200 last:border-b-0">
                    <button
                        onClick={() => setExpandedSegment(expandedSegment === segment.title ? null : segment.title)}
                        className="flex items-center justify-between w-full py-4 cursor-pointer text-left hover:bg-gray-50/50 transition-colors"
                        aria-expanded={expandedSegment === segment.title}
                    >
                        <h4 className="text-lg font-semibold text-gray-800">{segment.title}</h4>
                        <motion.div animate={{ rotate: expandedSegment === segment.title ? 180 : 0 }}>
                             <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                        {expandedSegment === segment.title && (
                             <motion.div
                                key="content"
                                initial="collapsed"
                                animate="open"
                                exit="collapsed"
                                variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="pb-4 pl-2">
                                    <ul className="space-y-3">
                                        {segment.items.map(item => (
                                            <li key={item.secondary}>
                                                <p className="font-bold text-blue-600 text-sm">{item.primary}</p>
                                                <p className="font-semibold text-gray-800">{item.secondary}</p>
                                                {item.tertiary && <p className="text-xs text-gray-500">{item.tertiary}</p>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getEventById(id);
                if (data) {
                    setEvent(data);
                } else {
                    setError('Event not found.');
                }
            } catch (err) {
                setError('Failed to fetch event data.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader /></div>;
    if (error || !event) return <div className="text-center py-40 text-red-500">{error || 'Event not found.'}</div>;

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
        link.searchParams.append('details', event.fullDescription);
        link.searchParams.append('location', event.location);
        return link.href;
    };

    return (
        <div className="bg-white min-h-screen">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[40vh] min-h-[300px] max-h-[400px] bg-gray-900"
            >
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-50"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{event.title}</h1>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
                    <div className="lg:col-span-2">
                        <motion.div 
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Event</h2>
                            <div className="prose lg:prose-lg text-gray-700 leading-relaxed">
                                <p>{event.fullDescription}</p>
                            </div>
                        </motion.div>

                        {event.segments && event.segments.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="mt-12"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                    {event.isUpcoming ? 'Program Details' : 'Event Segments & Winners'}
                                </h2>
                                <SegmentAccordion segments={event.segments} />
                            </motion.div>
                        )}
                    </div>

                    <aside className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="p-6 rounded-lg border border-gray-200/80 sticky top-28"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Event Details</h3>
                            <ul className="space-y-4 text-gray-700 text-sm">
                                <li className="flex items-start gap-3">
                                    <strong className="font-semibold text-gray-800">Date:</strong> 
                                    <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <strong className="font-semibold text-gray-800">Time:</strong> 
                                    <span>{event.time}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <strong className="font-semibold text-gray-800">Location:</strong> 
                                    <span>{event.location}</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                {event.isUpcoming && event.registrationLink && <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-opacity duration-300">Register Now</a>}
                                {event.isUpcoming && event.startTime24 && <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-md font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-300">Add to Calendar</a>}
                                {event.customButtons && event.customButtons.map(btn => (
                                     <a key={btn.text} href={btn.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-md font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
                                         <Icon name={btn.icon} />
                                         <span>{btn.text}</span>
                                     </a>
                                ))}
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;