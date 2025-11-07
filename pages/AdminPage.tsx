import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData } from '../services/firebaseService';
import type { AppData } from '../types';
import Loader from '../components/Loader';
import { useAuth } from '../components/Auth';
import DashboardEditor from '../components/admin/DashboardEditor';
import ThemeEditor from '../components/admin/ThemeEditor';
import FooterEditor from '../components/admin/FooterEditor';
import CrudEditor from '../components/admin/CrudEditor';
import LeadersEditor from '../components/admin/LeadersEditor';

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const AdminPage: React.FC = () => {
    const [appData, setAppData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { signOut, user } = useAuth();

    const loadData = useCallback(() => {
        setLoading(true);
        // Force refresh from server to get the latest data
        getAppData(true).then(d => {
            setAppData(deepClone(d));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    }
    if (!appData) {
        return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    }

    const tabs = [
        { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Theme', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
        { name: 'Footer', icon: 'M5 15l7-7 7 7' },
        { name: 'Departments', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Achievements', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Leaders', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2' },
    ];
    
    const renderContent = () => {
        // The entire appData state is passed down.
        // Child components will be responsible for their own state management and saving.
        switch (activeTab) {
            case 'Dashboard': return <DashboardEditor appData={appData} onDataChange={setAppData} />;
            case 'Theme': return <ThemeEditor appData={appData} onDataChange={setAppData} />;
            case 'Footer': return <FooterEditor appData={appData} onDataChange={setAppData} />;
            case 'Departments': return <CrudEditor title="Department" dataKey="departments" appData={appData} onDataChange={setAppData} />;
            case 'Events': return <CrudEditor title="Event" dataKey="events" appData={appData} onDataChange={setAppData} />;
            case 'Achievements': return <CrudEditor title="Achievement" dataKey="achievements" appData={appData} onDataChange={setAppData} />;
            case 'Leaders': return <LeadersEditor appData={appData} onDataChange={setAppData} />;
            default: return null;
        }
    };
    
    return (
        <div className="pt-24 bg-gray-100 min-h-screen text-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 pb-4 border-b border-gray-300">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                        <p className="text-gray-500">Welcome, {user?.email}!</p>
                    </div>
                     <button onClick={signOut} className="mt-4 sm:mt-0 px-6 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-colors shadow">
                        Logout
                    </button>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="md:w-1/5">
                         <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                            {tabs.map(tab => (
                                <button key={tab.name} onClick={() => setActiveTab(tab.name)} className={`w-full flex items-center gap-3 text-left p-3 rounded-md font-medium transition-colors whitespace-nowrap ${activeTab === tab.name ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-200'}`}>
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1 bg-white p-6 rounded-lg shadow-sm min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;