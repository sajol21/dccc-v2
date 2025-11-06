import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import Section from '../components/Section';
import type { Moderator, Executive } from '../types';

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const icons: { [key: string]: string } = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z",
        twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
    };
    return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d={icons[icon] || ''} />
        </svg>
    );
};

// A modern, interactive profile card for Executives
const ExecutiveProfileCard: React.FC<{ person: Executive | Moderator; onClick: () => void }> = ({ person, onClick }) => {
    return (
        <motion.button
            onClick={onClick}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
            className="group relative aspect-[4/5] w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg shadow-black/30 text-left"
        >
            <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-110" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

            <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white w-full">
                <h3 className="text-xl font-bold">{person.name}</h3>
                <p className="text-teal-300 text-sm">{person.position}</p>
                 {'tenureYears' in person && <p className="text-xs text-gray-400 mt-1">{(person as Executive).tenureYears}</p>}
            </div>
        </motion.button>
    );
};

const ProfileModal: React.FC<{ person: Moderator | Executive; onClose: () => void }> = ({ person, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50"
            >
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-teal-300">{person.name}</h2>
                    <p className="text-gray-300 mb-4">{person.position}</p>
                    
                    <div className="my-6 p-4 border border-blue-400 rounded-md">
                        <p className="text-gray-400 italic">{person.bio}</p>
                    </div>
                    
                    <div className="space-y-3 text-sm border-t border-gray-700 pt-4">
                        {person.dcccId && <p><span className="font-semibold text-gray-300 w-24 inline-block">DCCC ID:</span> <span className="text-gray-400">{person.dcccId}</span></p>}
                        {person.bloodGroup && <p><span className="font-semibold text-gray-300 w-24 inline-block">Blood Group:</span> <span className="text-gray-400">{person.bloodGroup}</span></p>}
                        {person.religion && <p><span className="font-semibold text-gray-300 w-24 inline-block">Religion:</span> <span className="text-gray-400">{person.religion}</span></p>}
                        {person.email && <p><span className="font-semibold text-gray-300 w-24 inline-block">Email:</span> <a href={`mailto:${person.email}`} className="text-teal-400 hover:underline">{person.email}</a></p>}
                        {person.phone && <p><span className="font-semibold text-gray-300 w-24 inline-block">Phone:</span> <a href={`tel:${person.phone}`} className="text-teal-400 hover:underline">{person.phone}</a></p>}
                    </div>

                    {person.socials && person.socials.length > 0 && (
                        <div className="flex space-x-4 mt-6 border-t border-gray-700 pt-4">
                            {person.socials.map(social => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-400 transition-colors">
                                    <span className="sr-only">{social.name}</span>
                                    <SocialIcon icon={social.icon} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                 <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
            </motion.div>
        </motion.div>
    )
}

const AccordionItem: React.FC<{
    year: string;
    executives: Executive[];
    onCardClick: (person: Executive) => void;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ year, executives, onCardClick, isExpanded, onToggle }) => {
    return (
        <div className="bg-gray-800/60 border border-gray-700 rounded-lg overflow-hidden">
            <motion.button
                initial={false}
                onClick={onToggle}
                className="flex items-center justify-between w-full p-6 cursor-pointer text-left"
            >
                <h3 className="text-2xl font-bold text-white">Panel of {year}</h3>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </motion.button>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 p-6">
                            {executives.map(p => <ExecutiveProfileCard key={p.id} person={p} onClick={() => onCardClick(p)} />)}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};


const LeadersPage: React.FC = () => {
    const { data: appData, loading, error } = useData(getAppData);
    const leadersData = appData?.leaders;
    const [selectedPerson, setSelectedPerson] = useState<Moderator | Executive | null>(null);

    const { pastExecutivesByYear, sortedYears, convenor, otherModerators } = useMemo(() => {
        if (!leadersData) return { pastExecutivesByYear: {}, sortedYears: [], convenor: null, otherModerators: [] };
        
        const grouped = leadersData.pastExecutives.reduce((acc, exec) => {
            const year = exec.tenureYears || 'Unknown';
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(exec);
            return acc;
        }, {} as Record<string, Executive[]>);
        
        const sorted = Object.keys(grouped).sort().reverse();

        const conv = leadersData.moderators?.[0] || null;
        const others = leadersData.moderators?.slice(1) || [];

        return { pastExecutivesByYear: grouped, sortedYears: sorted, convenor: conv, otherModerators: others };
    }, [leadersData]);

    const [expandedYear, setExpandedYear] = useState<string | null>(sortedYears[0] || null);


    if (loading) return <div className="h-screen flex items-center justify-center pt-20"><Loader /></div>;
    if (error || !leadersData) return <div className="text-center py-40 text-red-500">Failed to load leaders data.</div>;


    return (
        <div className="pt-28 pb-20 min-h-screen bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        Our Leaders
                    </h1>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                        Meet the dedicated individuals steering our club towards excellence.
                    </p>
                </motion.div>
                
                <Section title="Our Mentors" subtitle="Guiding our creative journey with wisdom and experience.">
                    {convenor && (
                        <motion.div 
                            className="flex justify-center mb-12"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-full sm:w-1/2 lg:w-1/3">
                                <ExecutiveProfileCard person={convenor} onClick={() => setSelectedPerson(convenor)} />
                            </div>
                        </motion.div>
                    )}
                    {otherModerators.length > 0 && (
                         <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
                        >
                           {otherModerators.map(p => <ExecutiveProfileCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />)}
                        </motion.div>
                    )}
                </Section>
                
                <Section title="Current Executive Body" subtitle="The passionate team leading our club's activities for the current session.">
                     <motion.div
                        className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                       {leadersData.currentExecutives.map(p => <ExecutiveProfileCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />)}
                    </motion.div>
                </Section>

                <Section title="Legacy of Leadership" subtitle="Honoring the past executives who shaped our club's history.">
                    <div className="max-w-7xl mx-auto space-y-4">
                        {sortedYears.map(year => (
                           <AccordionItem 
                                key={year}
                                year={year}
                                executives={pastExecutivesByYear[year]}
                                isExpanded={expandedYear === year}
                                onToggle={() => setExpandedYear(expandedYear === year ? null : year)}
                                onCardClick={(person) => setSelectedPerson(person)}
                           />
                        ))}
                    </div>
                </Section>
            </div>
            <AnimatePresence>
                {selectedPerson && (
                    <ProfileModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeadersPage;