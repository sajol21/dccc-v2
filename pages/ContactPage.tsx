import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getContactData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import Section from '../components/Section';

const ContactPage: React.FC = () => {
    const { data: contactData, loading, error } = useData(getContactData);
    const [formStatus, setFormStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('sending');
        // Simulate form submission
        setTimeout(() => {
            setFormStatus('success');
        }, 1500);
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    if (error || !contactData) return <div className="text-center py-40 text-red-500">Could not load contact information.</div>;

    return (
        <div className="pt-20 bg-white">
            <Section title="Get In Touch" subtitle="We'd love to hear from you! Whether you have a question, a proposal, or just want to say hello, feel free to reach out.">
                <div className="grid md:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                        <div className="space-y-4 text-gray-700">
                             <div className="flex items-start">
                                <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <div>
                                    <h4 className="font-semibold">Email</h4>
                                    <a href={`mailto:${contactData.email}`} className="text-blue-600 hover:underline">{contactData.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <div>
                                    <h4 className="font-semibold">Phone</h4>
                                    <a href={`tel:${contactData.phone.replace(/\s/g, '')}`} className="text-blue-600 hover:underline">{contactData.phone}</a>
                                </div>
                            </div>
                            <div className="flex items-start">
                                 <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <div>
                                    <h4 className="font-semibold">Address</h4>
                                    <p>{contactData.address}</p>
                                </div>
                            </div>
                        </div>
                        
                         <div className="mt-8 rounded-lg overflow-hidden border border-gray-200">
                             <iframe 
                                src={contactData.mapEmbedUrl}
                                width="100%" 
                                height="250" 
                                style={{ border: 0 }} 
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>

                    </motion.div>
                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-gray-50 p-8 rounded-lg border border-gray-200"
                    >
                         <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                         {formStatus === 'success' ? (
                             <div className="text-center p-8 bg-green-100 text-green-800 rounded-lg">
                                <h4 className="font-bold text-xl">Thank you!</h4>
                                <p>Your message has been sent successfully. We'll get back to you soon.</p>
                             </div>
                         ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        disabled={formStatus === 'sending'}
                                        className="w-full px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                         )}
                    </motion.div>
                </div>
            </Section>
        </div>
    );
};

export default ContactPage;
