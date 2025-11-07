
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData, saveAppData } from '../services/firebaseService';
// FIX: Removed non-existent type 'PastExecutive'.
import type { AppData, Department, Event, Achievement, Moderator, Executive } from '../types';
import Loader from '../components/Loader';
import { useAuth } from '../components/Auth';
import { useToast } from '../components/ToastProvider';

import AdminLayout from '../components/admin/AdminLayout';
import DashboardEditor from '../components/admin/DashboardEditor';
import ThemeEditor from '../components/admin/ThemeEditor';
import FooterEditor from '../components/admin/FooterEditor';
import CrudEditor from '../components/admin/CrudEditor';
import LeadersEditor from '../components/admin/LeadersEditor';

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const AdminPage: React.FC = () => {
    const [originalData, setOriginalData] = useState<AppData | null>(null);
    const [draftData, setDraftData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { signOut, user } = useAuth();
    const { addToast } = useToast();

    const loadData = useCallback(() => {
        setLoading(true);
        getAppData(true).then(d => {
            setOriginalData(deepClone(d));
            setDraftData(deepClone(d));
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const hasChanges = useMemo(() => {
        if (!originalData || !draftData) return false;
        return JSON.stringify(originalData) !== JSON.stringify(draftData);
    }, [originalData, draftData]);

    const handleSave = useCallback(async () => {
        if (!draftData) return;
        setIsSaving(true);
        try {
            await saveAppData(draftData);
            setOriginalData(deepClone(draftData));
            addToast('✅ Saved successfully!');
        } catch (error) {
            addToast('❌ Error saving data!', 'error');
        } finally {
            setIsSaving(false);
        }
    }, [draftData, addToast]);

    const handleReset = useCallback(() => {
        if (originalData) {
            setDraftData(deepClone(originalData));
            addToast('🔄 Changes have been reset.');
        }
    }, [originalData, addToast]);

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    }
    if (!draftData || !originalData) {
        return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': 
                return <DashboardEditor 
                           data={{ hero: draftData.hero, about: draftData.about, join: draftData.join }}
                           stats={{
                               departments: draftData.departments.length,
                               events: draftData.events.length,
                               achievements: draftData.achievements.length,
                               leaders: draftData.leaders.moderators.length + draftData.leaders.currentExecutives.length + draftData.leaders.pastExecutives.length
                           }}
                           onChange={(section, field, value) => {
                               setDraftData(prev => ({...prev!, [section]: { ...prev![section], [field]: value }}));
                           }}
                        />;
            case 'Theme': 
                return <ThemeEditor 
                            theme={draftData.theme} 
                            onChange={(newTheme) => setDraftData(prev => ({...prev!, theme: newTheme}))}
                       />;
            case 'Footer': 
                return <FooterEditor
                           footer={draftData.footer}
                           onChange={(newFooter) => setDraftData(prev => ({...prev!, footer: newFooter}))}
                       />;
            case 'Departments': 
                return <CrudEditor<Department> 
                            title="Department" 
                            items={draftData.departments} 
                            setItems={(newItems) => setDraftData(prev => ({ ...prev!, departments: newItems }))} 
                       />;
            case 'Events': 
                return <CrudEditor<Event> 
                            title="Event" 
                            items={draftData.events} 
                            setItems={(newItems) => setDraftData(prev => ({ ...prev!, events: newItems }))} 
                       />;
            case 'Achievements': 
                return <CrudEditor<Achievement> 
                            title="Achievement" 
                            items={draftData.achievements} 
                            setItems={(newItems) => setDraftData(prev => ({ ...prev!, achievements: newItems }))} 
                       />;
            case 'Leaders': 
                return <LeadersEditor 
                           leaders={draftData.leaders}
                           setLeaders={(newLeaders) => setDraftData(prev => ({ ...prev!, leaders: newLeaders }))}
                       />;
            default: return null;
        }
    };
    
    return (
        <AdminLayout
            user={user}
            signOut={signOut}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            hasChanges={hasChanges}
            isSaving={isSaving}
            onSave={handleSave}
            onReset={handleReset}
        >
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminPage;