import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData, saveAppData } from '../services/firebaseService';
import type { AppData } from '../types';
import Loader from '../components/Loader';
import { useAuth } from '../components/Auth';
import DashboardEditor from '../components/admin/DashboardEditor';
import ThemeEditor from '../components/admin/ThemeEditor';
import FooterEditor from '../components/admin/FooterEditor';
import CrudEditor from '../components/admin/CrudEditor';
import LeadersEditor from '../components/admin/LeadersEditor';

// A simple deep-clone function to avoid reference issues
const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const AdminPage: React.FC = () => {
    const [originalData, setOriginalData] = useState<AppData | null>(null);
    const [draftData, setDraftData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { signOut, user } = useAuth();

    const loadData = useCallback(() => {
        setLoading(true);
        // Force refresh from server
        getAppData(true).then(d => {
            setOriginalData(deepClone(d));
            setDraftData(deepClone(d));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSave = useCallback(async () => {
        if (!draftData) return;
        setIsSaving(true);
        setSaveMessage('Saving...');
        try {
            await saveAppData(draftData);
            setOriginalData(deepClone(draftData)); // Update original data to match new state
            setSaveMessage('✅ Saved successfully!');
        } catch (error) {
            setSaveMessage('❌ Error saving!');
        } finally {
            setTimeout(() => {
                setIsSaving(false);
                setSaveMessage('');
            }, 2000);
        }
    }, [draftData]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    }
    if (!draftData || !originalData) {
        return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    }

    const tabs = ['Dashboard', 'Theme', 'Footer', 'Departments', 'Events', 'Achievements', 'Leaders'];

    const renderContent = () => {
        const props = { originalData, draftData, setDraftData, handleSave, isSaving, saveMessage };
        switch (activeTab) {
            case 'Dashboard': return <DashboardEditor {...props} />;
            case 'Theme': return <ThemeEditor {...props} />;
            case 'Footer': return <FooterEditor {...props} />;
            case 'Departments': return <CrudEditor title="Department" dataKey="departments" {...props} />;
            case 'Events': return <CrudEditor title="Event" dataKey="events" {...props} />;
            case 'Achievements': return <CrudEditor title="Achievement" dataKey="achievements" {...props} />;
            case 'Leaders': return <LeadersEditor {...props} />;
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
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left p-3 rounded-md font-medium transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-200'}`}>
                                    {tab}
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
