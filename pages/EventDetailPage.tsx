import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getEventById } from '../services/firebaseService';
import Loader from '../components/Loader';
import type { Event } from '../types';

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

    if (loading) return <div className="h-screen flex items-center justify-center pt-20 bg-white"><Loader /></div>;
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
        <div className="pt-20 bg-white min-h-screen">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[50vh] min-h-[300px] max-h-[500px] bg-gray-900"
            >
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-50"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                    <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-4 inline-block">{event.category}</span>
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

                        {!event.isUpcoming && event.winners && event.winners.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.4 }}
                                className="mt-12"
                            >
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Winners</h2>
                                <div className="space-y-4">
                                    {event.winners.map((winner, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <p className="font-bold text-blue-600">{winner.position}</p>
                                            <p className="text-lg font-semibold text-gray-800">{winner.name}</p>
                                            <p className="text-sm text-gray-500">{winner.details}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <aside className="lg:col-span-1">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="bg-gray-50 p-6 rounded-lg border border-gray-200 sticky top-28"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Event Details</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-3"><strong className="w-16">Date:</strong> <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></li>
                                <li className="flex items-start gap-3"><strong className="w-16">Time:</strong> <span>{event.time}</span></li>
                                <li className="flex items-start gap-3"><strong className="w-16">Location:</strong> <span>{event.location}</span></li>
                            </ul>
                            {event.isUpcoming && (
                                <div className="mt-6 space-y-2">
                                    {event.registrationLink && <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300">Register Now</a>}
                                    {event.startTime24 && <a href={generateCalendarLink()} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-4 py-3 rounded-md font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-300">Add to Calendar</a>}
                                </div>
                            )}
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;