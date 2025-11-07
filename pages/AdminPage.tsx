
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

const departmentTemplate: Department = { id: '', name: '', iconUrl: '✨', shortDesc: '', fullDesc: '', coverImage: '', gallery: [], keyActivities: [], coordinatorId: '' };
const eventTemplate: Event = { id: '', title: '', shortDescription: '', fullDescription: '', date: new Date().toISOString(), time: '18:00', location: '', imageUrl: '', isUpcoming: true };
const achievementTemplate: Achievement = { id: '', title: '', description: '', date: new Date().toISOString(), imageUrl: '', category: '' };


const AdminPage: React.FC = () => {
    const { signOut, user } = useAuth();
    
    return (
        <AdminLayout user={user} signOut={signOut}>
            <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardEditor />} />
                <Route path="theme" element={<ThemeEditor />} />
                <Route path="footer" element={<FooterEditor />} />
                <Route 
                    path="departments" 
                    element={
                        <EditorWrapper
                            title="Departments"
                            description="Manage the creative wings of the club."
                            fetcher={getDepartments}
                            saver={saveDepartments}
                            children={(items, setItems) => (
                                <CrudEditor<Department> 
                                    title="Department"
                                    items={items}
                                    setItems={setItems}
                                    template={departmentTemplate}
                                />
                            )}
                        />
                    } 
                />
                <Route 
                    path="events" 
                    element={
                        <EditorWrapper
                            title="Events"
                            description="Manage all upcoming and past events."
                            fetcher={getEvents}
                            saver={saveEvents}
                            children={(items, setItems) => (
                                <CrudEditor<Event> 
                                    title="Event"
                                    items={items}
                                    setItems={setItems}
                                    template={eventTemplate}
                                />
                            )}
                        />
                    } 
                />
                <Route 
                    path="achievements" 
                    element={
                         <EditorWrapper
                            title="Achievements"
                            description="Showcase the club's accomplishments."
                            fetcher={getAchievements}
                            saver={saveAchievements}
                            children={(items, setItems) => (
                                <CrudEditor<Achievement> 
                                    title="Achievement"
                                    items={items}
                                    setItems={setItems}
                                    template={achievementTemplate}
                                />
                            )}
                        />
                    } 
                />
                <Route path="leaders" element={<LeadersEditor />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminPage;
