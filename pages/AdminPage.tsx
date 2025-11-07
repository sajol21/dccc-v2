import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAppData, saveAppData } from '../services/firebaseService';
import type { AppData } from '../types';
import Loader from '../components/Loader';

const AdminPage: React.FC = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('General');
    const navigate = useNavigate();

    useEffect(() => {
        getAppData().then(d => {
            setData(d);
            setLoading(false);
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!data) return;
        setIsSaving(true);
        await saveAppData(data);
        setTimeout(() => setIsSaving(false), 1000); 
    }, [data]);

    const handleFieldChange = (section: keyof AppData, field: string, value: any) => {
        setData(prev => {
            if (!prev) return null;
            return { ...prev, [section]: { ...prev[section], [field]: value } };
        });
    };
    
    const handleLogout = () => {
        sessionStorage.removeItem('isAdminLoggedIn');
        navigate('/login');
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    }
    if (!data) {
        return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    }

    const tabs = ['General', 'Departments', 'Events', 'Achievements', 'Leaders'];

    return (
        <div className="pt-24 bg-gray-100 min-h-screen text-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 pb-4 border-b border-gray-300">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                        <p className="text-gray-500">Edit your website content below. Changes are saved locally in your browser.</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <button 
                            onClick={handleLogout} 
                            className="px-6 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-colors shadow"
                        >
                            Logout
                        </button>
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow"
                        >
                            {isSaving ? 'Saving...' : 'Save All Changes'}
                        </button>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="md:w-1/5">
                        <nav className="flex flex-row md:flex-col gap-2">
                            {tabs.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full text-left p-3 rounded-md font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-200'}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
                        {activeTab === 'General' && <GeneralEditor data={data} onFieldChange={handleFieldChange} />}
                        {activeTab === 'Departments' && <CrudEditor title="Department" items={data.departments} setItems={items => setData(p => ({...p!, departments: items}))} />}
                        {activeTab === 'Events' && <CrudEditor title="Event" items={data.events} setItems={items => setData(p => ({...p!, events: items}))} />}
                        {activeTab === 'Achievements' && <CrudEditor title="Achievement" items={data.achievements} setItems={items => setData(p => ({...p!, achievements: items}))} />}
                        {activeTab === 'Leaders' && <LeadersEditor leaders={data.leaders} setLeaders={leaders => setData(p => ({...p!, leaders}))} />}
                    </main>
                </div>
            </div>
        </div>
    );
};

const Section: React.FC<{title:string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="mb-8 p-4 border rounded-md">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormInput: React.FC<any> = ({ label, value, onChange, type = 'text', ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'textarea' ? (
             <textarea value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" {...props}></textarea>
        ) : type === 'checkbox' ? (
            <input type="checkbox" checked={value} onChange={onChange} className="mt-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" {...props} />
        ) : (
            <input type={type} value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" {...props} />
        )}
    </div>
);

const GeneralEditor: React.FC<{ data: AppData, onFieldChange: (section: keyof AppData, field: string, value: any) => void }> = ({ data, onFieldChange }) => (
    <div>
        <Section title="Hero Section">
            <FormInput label="Headline" value={data.hero.headline} onChange={e => onFieldChange('hero', 'headline', e.target.value)} />
            <FormInput label="Tagline" value={data.hero.tagline} onChange={e => onFieldChange('hero', 'tagline', e.target.value)} />
        </Section>
        <Section title="About Section">
            <FormInput label="Short Text" type="textarea" value={data.about.shortText} onChange={e => onFieldChange('about', 'shortText', e.target.value)} />
            <FormInput label="Full Text" type="textarea" rows={5} value={data.about.fullText} onChange={e => onFieldChange('about', 'fullText', e.target.value)} />
            <FormInput label="Image URL" value={data.about.imageUrl} onChange={e => onFieldChange('about', 'imageUrl', e.target.value)} />
            <FormInput label="Video URL" value={data.about.videoUrl} onChange={e => onFieldChange('about', 'videoUrl', e.target.value)} />
            <FormInput label="Vision Tagline" value={data.about.visionTagline} onChange={e => onFieldChange('about', 'visionTagline', e.target.value)} />
        </Section>
         <Section title="Join Us Section">
            <FormInput label="Title" value={data.join.title} onChange={e => onFieldChange('join', 'title', e.target.value)} />
            <FormInput label="Description" type="textarea" value={data.join.description} onChange={e => onFieldChange('join', 'description', e.target.value)} />
            <FormInput label="Button Text" value={data.join.buttonText} onChange={e => onFieldChange('join', 'buttonText', e.target.value)} />
            <FormInput label="Button Link" value={data.join.buttonLink} onChange={e => onFieldChange('join', 'buttonLink', e.target.value)} />
        </Section>
        <Section title="Footer">
            <FormInput label="About Text" value={data.footer.aboutText} onChange={e => onFieldChange('footer', 'aboutText', e.target.value)} />
            <FormInput label="Email" value={data.footer.email} onChange={e => onFieldChange('footer', 'email', e.target.value)} />
            <FormInput label="Phone" value={data.footer.phone} onChange={e => onFieldChange('footer', 'phone', e.target.value)} />
            <FormInput label="Address" value={data.footer.address} onChange={e => onFieldChange('footer', 'address', e.target.value)} />
        </Section>
    </div>
);

const CrudEditor: React.FC<{title: string, items: any[], setItems: (items: any[]) => void}> = ({ title, items, setItems }) => {
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const handleSave = (itemToSave: any) => {
        const isNew = !items.find(i => i.id === itemToSave.id);
        if(isNew) {
            setItems([...items, itemToSave]);
        } else {
            setItems(items.map(i => i.id === itemToSave.id ? itemToSave : i));
        }
        setEditingItem(null);
    };

    const handleCreate = () => {
        if (items.length === 0) {
            setEditingItem({id: `${title.toLowerCase()}_${Date.now()}`});
            return;
        }
        const newItem = { ...items[0] };
        Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'string') newItem[key] = '';
            if (typeof newItem[key] === 'boolean') newItem[key] = false;
            if (Array.isArray(newItem[key])) newItem[key] = [];
        });
        newItem.id = `${title.toLowerCase()}_${Date.now()}`;
        newItem.title = "New " + title;
        setEditingItem(newItem);
    };

    const handleDelete = (id: string) => {
        if(window.confirm(`Are you sure you want to delete this ${title}?`)) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}s</h2>
                <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors shadow">Add New</button>
            </div>
            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <p className="font-medium">{item.name || item.title}</p>
                        <div className="space-x-2">
                            <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
            <AnimatePresence>
                {editingItem && <EditModal item={editingItem} onSave={handleSave} onClose={() => setEditingItem(null)} />}
            </AnimatePresence>
        </div>
    );
};

const LeadersEditor: React.FC<{leaders: AppData['leaders'], setLeaders: (leaders: AppData['leaders']) => void}> = ({ leaders, setLeaders }) => {
    return (
        <div>
            <CrudEditor 
                title="Moderator" 
                items={leaders.moderators} 
                setItems={items => setLeaders({...leaders, moderators: items})}
            />
             <div className="my-8 border-t"></div>
            <CrudEditor 
                title="Current Executive" 
                items={leaders.currentExecutives} 
                setItems={items => setLeaders({...leaders, currentExecutives: items})}
            />
             <div className="my-8 border-t"></div>
            <CrudEditor 
                title="Past Executive" 
                items={leaders.pastExecutives} 
                setItems={items => setLeaders({...leaders, pastExecutives: items})}
            />
        </div>
    )
}

const EditModal: React.FC<{item: any, onSave: (item: any) => void, onClose: () => void}> = ({ item, onSave, onClose }) => {
    const [currentItem, setCurrentItem] = useState(item);

    const handleChange = (key: string, value: any) => {
        setCurrentItem((prev: any) => ({...prev, [key]: value}));
    };

    const renderField = (key: string, value: any) => {
        if (key === 'id') return null;
        if (typeof value === 'boolean') {
            return <FormInput key={key} label={key} type="checkbox" checked={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.checked)} />;
        }
        if (typeof value === 'string' || typeof value === 'number') {
            const isLongText = typeof value === 'string' && (value.length > 100 || value.includes('\n'));
            return <FormInput key={key} label={key} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)} type={isLongText ? 'textarea' : 'text'} rows={isLongText ? 4 : 1} />;
        }
        if (Array.isArray(value)) {
            // Simple array of strings
             if (value.every(v => typeof v === 'string')) {
                return <FormInput key={key} label={`${key} (one per line)`} type="textarea" rows={4} value={value.join('\n')} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(key, e.target.value.split('\n'))} />;
            }
            // Array of objects, render as JSON
            return <FormInput key={key} label={`${key} (JSON format)`} type="textarea" rows={6} value={JSON.stringify(value, null, 2)} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { try { handleChange(key, JSON.parse(e.target.value)) } catch (err) { console.error("Invalid JSON") } }} />;
        }
       return null;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-2xl shadow-xl relative max-h-[90vh] flex flex-col">
                 <header className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Edit {item.name || item.title}</h3>
                    <button onClick={onClose}>&times;</button>
                </header>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {Object.entries(currentItem).map(([key, value]) => renderField(key, value))}
                </div>
                <footer className="p-4 border-t flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                    <button onClick={() => onSave(currentItem)} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">Save</button>
                </footer>
            </motion.div>
        </motion.div>
    )
}

export default AdminPage;