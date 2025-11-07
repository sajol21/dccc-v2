import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Moderator, Executive } from '../types';

type Person = Moderator | Executive;

const SocialIcon: React.FC<{ icon: string }> = ({ icon }) => {
    const icons: { [key: string]: string } = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
    };
    return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d={icons[icon] || ''} />
        </svg>
    )
}

const MemberDetailModal: React.FC<{ person: Person, onClose: () => void }> = ({ person, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl w-full max-w-sm md:max-w-md shadow-2xl relative overflow-hidden"
            >
                 <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 transition-colors z-10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="h-48 bg-gray-100 flex justify-center items-end p-4">
                     <img src={person.imageUrl} alt={person.name} className="h-full w-auto object-contain" loading="lazy" decoding="async" />
                </div>
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{person.name}</h2>
                    <p className="text-blue-600 font-semibold">{person.position}</p>
                    {person.bio && <p className="text-gray-600 mt-4 text-sm">{person.bio}</p>}
                </div>
                {'tenureYears' in person && (
                     <div className="px-6 py-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
                        <div><strong className="block text-gray-500 text-xs">Tenure</strong> {person.tenureYears}</div>
                        <div><strong className="block text-gray-500 text-xs">ID</strong> {person.dcccId}</div>
                        <div><strong className="block text-gray-500 text-xs">Blood G</strong> {person.bloodGroup}</div>
                        <div><strong className="block text-gray-500 text-xs">Religion</strong> {person.religion}</div>
                    </div>
                )}
                 {person.socials && person.socials.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-4">
                        {person.socials.map(social => (
                            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                                <SocialIcon icon={social.icon} />
                            </a>
                        ))}
                    </div>
                 )}
            </motion.div>
        </motion.div>
    )
}

const ModeratorCard: React.FC<{ person: Moderator, isMain?: boolean, onClick: () => void }> = ({ person, isMain = false, onClick }) => {
    const cardSize = isMain ? 'md:w-72 w-full' : 'w-full';

    return (
        <div onClick={onClick} className={`relative ${cardSize} aspect-[0.85] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl overflow-hidden shadow-lg mx-auto cursor-pointer group`}>
            <img src={person.imageUrl} alt={person.name} className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white w-full text-center">
                <h3 className="font-bold text-md leading-tight">{person.name}</h3>
                <p className="text-xs opacity-90 uppercase">{person.position}</p>
            </div>
        </div>
    );
};

const MemberCard: React.FC<{ person: Executive, onClick: () => void }> = ({ person, onClick }) => {
    return (
        <div onClick={onClick} className="relative aspect-[0.85] bg-white rounded-2xl overflow-hidden shadow-sm group border border-gray-200 cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <img src={person.imageUrl} alt={person.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-3 text-white w-full text-center">
                <h3 className="font-bold text-sm leading-tight">{person.name}</h3>
                <p className="text-xs opacity-90 uppercase">{person.position}</p>
            </div>
        </div>
    );
};


const PastPanelAccordion: React.FC<{
    year: string;
    executives: Executive[];
    isExpanded: boolean;
    onToggle: () => void;
    onMemberClick: (person: Executive) => void;
}> = ({ year, executives, isExpanded, onToggle, onMemberClick }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
                onClick={onToggle}
                className="flex items-center justify-between w-full p-4 cursor-pointer text-left"
                aria-expanded={isExpanded}
            >
                <h3 className="text-lg font-semibold text-gray-800">Panel of {year}</h3>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>
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
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-gray-50">
                            {executives.map(p => <MemberCard key={p.id} person={p} onClick={() => onMemberClick(p)} />)}
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
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    const { 
        pastExecutivesByYear, 
        sortedYears, 
        mainModerator, 
        otherModerators,
        topSecretariat,
        otherSecretariat,
        executiveMembers,
    } = useMemo(() => {
        if (!leadersData) return { 
            pastExecutivesByYear: {}, 
            sortedYears: [], 
            mainModerator: null, 
            otherModerators: [],
            topSecretariat: [],
            otherSecretariat: [],
            executiveMembers: [],
        };
        
        const grouped = leadersData.pastExecutives.reduce((acc, exec) => {
            const year = exec.tenureYears?.match(/\d{4}$/)?.[0] || 'Unknown';
            if (year === 'Unknown') return acc;
            if (!acc[year]) acc[year] = [];
            acc[year].push(exec);
            return acc;
        }, {} as Record<string, Executive[]>);
        
        const sorted = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

        const allCurrent = leadersData.currentExecutives;
        
        const topSecretariat = [
            allCurrent.find(m => m.position.includes("President")),
            allCurrent.find(m => m.position.includes("General Secretary")),
            allCurrent.find(m => m.position.includes("Vice President")),
        ].filter((m): m is Executive => !!m);

        const otherSecretariat = [
            allCurrent.find(m => m.position.includes("Operating Secretary")),
            allCurrent.find(m => m.position.includes("Joint Secretary")),
            allCurrent.find(m => m.position.includes("IT Secretary")),
            allCurrent.find(m => m.position.includes("Financial Secretary")),
        ].filter((m): m is Executive => !!m);
        
        const secretariatIds = new Set([...topSecretariat, ...otherSecretariat].map(m => m.id));
        const executiveMembers = allCurrent.filter(m => !secretariatIds.has(m.id));

        return { 
            pastExecutivesByYear: grouped, 
            sortedYears: sorted, 
            mainModerator: leadersData.moderators[0] || null, 
            otherModerators: leadersData.moderators.slice(1),
            topSecretariat,
            otherSecretariat,
            executiveMembers,
        };
    }, [leadersData]);

    const [expandedYear, setExpandedYear] = useState<string | null>(sortedYears[0] || null);

    if (loading) return <div className="h-screen flex items-center justify-center pt-20 bg-white"><Loader /></div>;
    if (error || !leadersData) return <div className="text-center py-40 text-red-500 bg-white">Failed to load leaders data.</div>;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white text-gray-900 font-sans">
            <AnimatePresence>
                {selectedPerson && <MemberDetailModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />}
            </AnimatePresence>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-20">
                    <h1 className="text-5xl font-extrabold mb-4 text-gray-900">Our Panel</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Meet the guiding mentors and the dedicated student leaders who steer our club.
                    </p>
                </header>

                <section className="mb-28">
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-10">Convenor & Moderator Panel</h2>
                    <div className="flex flex-col items-center gap-10">
                        {mainModerator && <div className="max-w-xs"><ModeratorCard person={mainModerator} isMain onClick={() => setSelectedPerson(mainModerator)} /></div>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
                           {otherModerators.map(p => <ModeratorCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />)}
                        </div>
                    </div>
                </section>
                
                <section className="mb-24">
                    <h2 className="text-4xl font-bold text-center mb-16">Current Panel (2025)</h2>
                    
                    <div className="bg-gray-50 rounded-3xl py-16 mb-16">
                         <h3 className="text-3xl font-bold text-blue-600 text-center mb-12">Secretariat Panel</h3>
                         <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-8 px-4">
                           {topSecretariat.map(p => <div key={p.id} className="w-44 sm:w-48 md:w-52"><MemberCard person={p} onClick={() => setSelectedPerson(p)} /></div>)}
                        </div>
                         <div className="flex flex-wrap justify-center gap-6 md:gap-8 px-4">
                           {otherSecretariat.map(p => <div key={p.id} className="w-44 sm:w-48 md:w-52"><MemberCard person={p} onClick={() => setSelectedPerson(p)} /></div>)}
                        </div>
                    </div>

                    <div>
                         <h3 className="text-3xl font-bold text-blue-600 text-center mb-12">Executive Panel</h3>
                         <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                {executiveMembers.map(p => (
                                    <MemberCard key={p.id} person={p} onClick={() => setSelectedPerson(p)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-blue-600 text-center mb-10">Past Panels</h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                        {sortedYears.map(year => (
                           <PastPanelAccordion
                                key={year}
                                year={year}
                                executives={pastExecutivesByYear[year]}
                                isExpanded={expandedYear === year}
                                onToggle={() => setExpandedYear(expandedYear === year ? null : year)}
                                onMemberClick={(person) => setSelectedPerson(person)}
                           />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LeadersPage;