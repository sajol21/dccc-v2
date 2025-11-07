
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/Auth';

import AdminLayout from '../components/admin/AdminLayout';
import DashboardEditor from '../components/admin/DashboardEditor';
import ThemeEditor from '../components/admin/ThemeEditor';
import FooterEditor from '../components/admin/FooterEditor';
import LeadersEditor from '../components/admin/LeadersEditor';
import EditorWrapper from '../components/admin/EditorWrapper';
import CrudEditor from '../components/admin/CrudEditor';
import { Department, Event, Achievement } from '../types';
import { getDepartments, saveDepartments, getEvents, saveEvents, getAchievements, saveAchievements } from '../services/firebaseService';

const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { signOut, user } = useAuth();
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Dashboard': 
                return <DashboardEditor />;
            case 'Theme': 
                return <ThemeEditor />;
            case 'Footer': 
                return <FooterEditor />;
            case 'Departments': 
                return (
                    <EditorWrapper
                        title="Departments"
                        description="Manage the creative wings of the club."
                        fetcher={getDepartments}
                        saver={saveDepartments}
// FIX: Pass children as an explicit prop to satisfy TypeScript
                        children={(items, setItems) => (
                            <CrudEditor<Department> 
                                title="Department"
                                items={items}
                                setItems={setItems}
                            />
                        )}
                    />
                );
            case 'Events': 
                return (
                    <EditorWrapper
                        title="Events"
                        description="Manage all upcoming and past events."
                        fetcher={getEvents}
                        saver={saveEvents}
// FIX: Pass children as an explicit prop to satisfy TypeScript
                        children={(items, setItems) => (
                            <CrudEditor<Event> 
                                title="Event"
                                items={items}
                                setItems={setItems}
                            />
                        )}
                    />
                );
            case 'Achievements': 
                 return (
                    <EditorWrapper
                        title="Achievements"
                        description="Showcase the club's accomplishments."
                        fetcher={getAchievements}
                        saver={saveAchievements}
// FIX: Pass children as an explicit prop to satisfy TypeScript
                        children={(items, setItems) => (
                            <CrudEditor<Achievement> 
                                title="Achievement"
                                items={items}
                                setItems={setItems}
                            />
                        )}
                    />
                );
            case 'Leaders': 
                return <LeadersEditor />;
            default: return null;
        }
    };
    
    return (
        <AdminLayout
            user={user}
            signOut={signOut}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            <AnimatePresence mode="wait">
                <motion.div 
                    key={activeTab} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -20 }} 
                    transition={{ duration: 0.2 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminPage;