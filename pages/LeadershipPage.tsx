import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Moderator, Executive } from '../types';

const ModeratorCard: React.FC<{ person: Moderator, isMain?: boolean }> = ({ person, isMain = false }) => {
    const cardSize = isMain ? 'w-64' : 'w-full';

    return (
        <div className={`relative ${cardSize} aspect-[0.85] bg-yellow-400 rounded-2xl overflow-hidden shadow-lg mx-auto`}>
            <img src={person.imageUrl} alt={person.name} className="w-full h-full object-contain object-bottom" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white w-full text-center">
                <h3 className="font-bold text-md leading-tight">{person.name}</h3>
                <p className="text-xs opacity-90 uppercase">{person.position}</p>
            </div>
        </div>
    );
};

const MemberCard: React.FC<{ person: Executive }> = ({ person }) => {
    return (
        <div className="relative aspect-[0.85] bg-slate-100 rounded-2xl overflow-hidden shadow-md group">
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <img src={person.imageUrl} alt={person.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
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
}> = ({ year, executives, isExpanded, onToggle }) => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
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
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6 bg-white">
                            {executives.map(p => <MemberCard key={p.id} person={p} />)}
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

    const { 
        pastExecutivesByYear, 
        sortedYears, 
        mainModerator, 
        otherModerators,
        secretariatPanel,
        executiveMembers
    } = useMemo(() => {
        if (!leadersData) return { 
            pastExecutivesByYear: {}, 
            sortedYears: [], 
            mainModerator: null, 
            otherModerators: [],
            secretariatPanel: [],
            executiveMembers: []
        };
        
        const grouped = leadersData.pastExecutives.reduce((acc, exec) => {
            const year = exec.tenureYears?.match(/\d{4}$/)?.[0] || 'Unknown';
            if (year === 'Unknown') return acc;
            if (!acc[year]) acc[year] = [];
            acc[year].push(exec);
            return acc;
        }, {} as Record<string, Executive[]>);
        
        const sorted = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

        const SECRETARIAT_POSITIONS = [
            'President', 'General Secretary', 'Vice President', 'Operating Secretary', 
            'Joint Secretary', 'IT Secretary', 'Financial Secretary', 'Treasurer'
        ];

        const currentSecretariat = leadersData.currentExecutives.filter(p => 
            SECRETARIAT_POSITIONS.some(pos => p.position.startsWith(pos))
        );
        
        const currentExecutives = leadersData.currentExecutives.filter(p => 
            !SECRETARIAT_POSITIONS.some(pos => p.position.startsWith(pos))
        );

        return { 
            pastExecutivesByYear: grouped, 
            sortedYears: sorted, 
            mainModerator: leadersData.moderators[0] || null, 
            otherModerators: leadersData.moderators.slice(1),
            secretariatPanel: currentSecretariat,
            executiveMembers: currentExecutives,
        };
    }, [leadersData]);

    const [expandedYear, setExpandedYear] = useState<string | null>(sortedYears[0] || null);

    if (loading) return <div className="h-screen flex items-center justify-center pt-20 bg-white"><Loader /></div>;
    if (error || !leadersData) return <div className="text-center py-40 text-red-500 bg-white">Failed to load leaders data.</div>;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white text-gray-900 font-sans">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-20">
                    <h1 className="text-5xl font-extrabold mb-4 text-slate-900">Our Panel</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Meet the guiding mentors and the dedicated student leaders who steer our club.
                    </p>
                </header>

                <section className="mb-24">
                    <h2 className="text-3xl font-bold text-red-600 text-center mb-10">Moderator Panel</h2>
                    <div className="flex flex-col items-center gap-10">
                        {mainModerator && <ModeratorCard person={mainModerator} isMain />}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-5xl">
                           {otherModerators.map(p => <ModeratorCard key={p.id} person={p} />)}
                        </div>
                    </div>
                </section>
                
                <section className="mb-24 bg-slate-50 rounded-3xl py-16">
                     <h2 className="text-3xl font-bold text-red-600 text-center mb-12">Current Panel (2025)</h2>
                     
                     <div className="mb-16">
                         <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Secretariat Panel</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
                           {secretariatPanel.map(p => <MemberCard key={p.id} person={p} />)}
                        </div>
                     </div>

                     <div>
                         <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">Executive Members</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
                           {executiveMembers.map(p => <MemberCard key={p.id} person={p} />)}
                        </div>
                     </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-red-600 text-center mb-10">Past Panels</h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                        {sortedYears.map(year => (
                           <PastPanelAccordion
                                key={year}
                                year={year}
                                executives={pastExecutivesByYear[year]}
                                isExpanded={expandedYear === year}
                                onToggle={() => setExpandedYear(expandedYear === year ? null : year)}
                           />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LeadersPage;