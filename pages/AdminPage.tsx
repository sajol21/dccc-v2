import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAppData, saveAppData } from '../services/firebaseService';
import type { AppData, Department, Event, Achievement, LeadersData, FooterData, ThemeData } from '../types';
import Loader from '../components/Loader';
import { useAuth } from '../components/Auth';

const AdminPage: React.FC = () => {
    const [data, setData] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [activeTab, setActiveTab] = useState('Dashboard');
    const { signOut, user } = useAuth();

    useEffect(() => {
        getAppData().then(d => {
            setData(d);
            setLoading(false);
        });
    }, []);

    const handleSave = useCallback(async () => {
        if (!data) return;
        setIsSaving(true);
        setSaveMessage('Saving...');
        try {
            await saveAppData(data);
            setSaveMessage('✅ Saved successfully!');
        } catch (error) {
            setSaveMessage('❌ Error saving!');
        } finally {
            setTimeout(() => {
                setIsSaving(false);
                setSaveMessage('');
            }, 2000);
        }
    }, [data]);

    const handleDataChange = (key: keyof AppData, value: any) => {
        setData(prev => (prev ? { ...prev, [key]: value } : null));
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center"><Loader /></div>;
    }
    if (!data) {
        return <div className="text-center py-20 text-red-500">Error loading page data.</div>;
    }

    const tabs = ['Dashboard', 'Theme & Animation', 'Footer', 'Departments', 'Events', 'Achievements', 'Leaders'];

    return (
        <div className="pt-24 bg-gray-100 min-h-screen text-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 pb-4 border-b border-gray-300">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Panel</h1>
                        <p className="text-gray-500">Welcome, {user?.email}! Manage your website content here.</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                        <button onClick={signOut} className="px-6 py-2 bg-gray-500 text-white rounded-md font-semibold hover:bg-gray-600 transition-colors shadow">
                            Logout
                        </button>
                        <div className="relative">
                            <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow w-40">
                                {isSaving ? 'Saving...' : 'Save All Changes'}
                            </button>
                             <AnimatePresence>
                                {saveMessage && (
                                    <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute -bottom-6 right-0 text-xs font-semibold text-gray-600 whitespace-nowrap">{saveMessage}</motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
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
                                {activeTab === 'Dashboard' && <DashboardEditor data={data} setData={setData} />}
                                {activeTab === 'Theme & Animation' && <ThemeEditor theme={data.theme} setTheme={(theme: ThemeData) => handleDataChange('theme', theme)} />}
                                {activeTab === 'Footer' && <FooterEditor footer={data.footer} setFooter={(footer: FooterData) => handleDataChange('footer', footer)} />}
                                {activeTab === 'Departments' && <CrudEditor title="Department" items={data.departments} setItems={items => handleDataChange('departments', items)} />}
                                {activeTab === 'Events' && <CrudEditor title="Event" items={data.events} setItems={items => handleDataChange('events', items)} />}
                                {activeTab === 'Achievements' && <CrudEditor title="Achievement" items={data.achievements} setItems={items => handleDataChange('achievements', items)} />}
                                {activeTab === 'Leaders' && <LeadersEditor leaders={data.leaders} setLeaders={leaders => handleDataChange('leaders', leaders)} />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components for Admin Panel ---

const getHumanLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const Section: React.FC<{title:string, children: React.ReactNode, description?: string}> = ({ title, children, description }) => (
    <div className="mb-8 p-4 border rounded-md bg-gray-50/50">
        <h3 className="text-xl font-bold mb-1 border-b pb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        <div className="space-y-4 pt-2">{children}</div>
    </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)} className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}>
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

const RichTextEditor: React.FC<{ value: string; onChange: (value: string) => void; }> = ({ value, onChange }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        if (editorRef.current) onChange(editorRef.current.innerHTML);
    };

    const execCmd = (cmd: string) => {
        document.execCommand(cmd, false);
        editorRef.current?.focus();
        handleInput();
    };
    
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    return (
        <div className="border border-gray-300 rounded-md">
            <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
                <button type="button" onClick={() => execCmd('bold')} className="font-bold w-7 h-7 hover:bg-gray-200 rounded">B</button>
                <button type="button" onClick={() => execCmd('italic')} className="italic w-7 h-7 hover:bg-gray-200 rounded">I</button>
                <button type="button" onClick={() => execCmd('insertUnorderedList')} className="w-7 h-7 hover:bg-gray-200 rounded">UL</button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="prose max-w-none p-3 min-h-[120px] focus:outline-none"
            />
        </div>
    );
};

const FormInput: React.FC<any> = ({ label, value, onChange, type = 'text', ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {type === 'richtext' ? <RichTextEditor value={value} onChange={onChange} />
        : type === 'textarea' ? <textarea value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" {...props}></textarea>
        : type === 'toggle' ? <ToggleSwitch checked={value} onChange={onChange} />
        : <input type={type} value={value} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" {...props} /> }
    </div>
);

const ImagePreviewInput: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-4 mt-1">
            <input type="text" value={value} onChange={onChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            {value && <img src={value} alt="preview" className="w-16 h-16 object-cover rounded-md border bg-gray-100" />}
        </div>
    </div>
);

const DashboardEditor: React.FC<{ data: AppData, setData: (data: AppData) => void }> = ({ data, setData }) => {
    const handleFieldChange = (section: keyof AppData, field: string, value: any) => {
        setData({ ...data, [section]: { ...data[section], [field]: value } });
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{data.departments.length}</p>
                    <p className="text-sm font-medium text-blue-800">Departments</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{data.events.length}</p>
                    <p className="text-sm font-medium text-green-800">Events</p>
                </div>
                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-yellow-600">{data.achievements.length}</p>
                    <p className="text-sm font-medium text-yellow-800">Achievements</p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-indigo-600">{data.leaders.moderators.length + data.leaders.currentExecutives.length + data.leaders.pastExecutives.length}</p>
                    <p className="text-sm font-medium text-indigo-800">Leaders</p>
                </div>
            </div>
            <Section title="Hero Section">
                <FormInput label="Headline" value={data.hero.headline} onChange={e => handleFieldChange('hero', 'headline', e.target.value)} />
                <FormInput label="Tagline" value={data.hero.tagline} onChange={e => handleFieldChange('hero', 'tagline', e.target.value)} />
            </Section>
            <Section title="About Section">
                <FormInput label="Short Text" type="textarea" value={data.about.shortText} onChange={e => handleFieldChange('about', 'shortText', e.target.value)} />
                <FormInput label="Full Text" type="richtext" value={data.about.fullText} onChange={(val: string) => handleFieldChange('about', 'fullText', val)} />
                <ImagePreviewInput label="Image URL" value={data.about.imageUrl} onChange={e => handleFieldChange('about', 'imageUrl', e.target.value)} />
                <FormInput label="Video URL" value={data.about.videoUrl} onChange={e => handleFieldChange('about', 'videoUrl', e.target.value)} />
                <FormInput label="Vision Tagline" value={data.about.visionTagline} onChange={e => handleFieldChange('about', 'visionTagline', e.target.value)} />
            </Section>
             <Section title="Join Us Section">
                <FormInput label="Title" value={data.join.title} onChange={e => handleFieldChange('join', 'title', e.target.value)} />
                <FormInput label="Description" type="textarea" value={data.join.description} onChange={e => handleFieldChange('join', 'description', e.target.value)} />
                <FormInput label="Button Text" value={data.join.buttonText} onChange={e => handleFieldChange('join', 'buttonText', e.target.value)} />
                <FormInput label="Button Link" value={data.join.buttonLink} onChange={e => handleFieldChange('join', 'buttonLink', e.target.value)} />
            </Section>
        </div>
    );
};

const ThemeEditor: React.FC<{ theme: ThemeData; setTheme: (theme: ThemeData) => void; }> = ({ theme, setTheme }) => {
    const handleChange = (field: keyof ThemeData, value: any) => {
        setTheme({ ...theme, [field]: value });
    };

    return (
        <Section title="Hero Animation Theme" description="Customize the interactive mesh animation on the homepage.">
            <FormInput label="Background Color" type="color" value={theme.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} />
            <FormInput label="Node Color" type="color" value={theme.nodeColor} onChange={e => handleChange('nodeColor', e.target.value)} />
            <FormInput label="Line Color" type="color" value={theme.lineColor} onChange={e => handleChange('lineColor', e.target.value)} />
            <FormInput label="Highlight Color" type="color" value={theme.highlightColor} onChange={e => handleChange('highlightColor', e.target.value)} />
            <FormInput label="Line Highlight Color" type="color" value={theme.lineHighlightColor} onChange={e => handleChange('lineHighlightColor', e.target.value)} />
            <FormInput label={`Node Density (${theme.nodeDensity})`} type="range" min="5000" max="20000" step="100" value={theme.nodeDensity} onChange={e => handleChange('nodeDensity', parseInt(e.target.value))} />
            <FormInput label={`Node Size (${theme.nodeSize})`} type="range" min="1" max="5" step="0.1" value={theme.nodeSize} onChange={e => handleChange('nodeSize', parseFloat(e.target.value))} />
            <FormInput label={`Mouse Repel Strength (${theme.mouseRepelStrength})`} type="range" min="0" max="10" step="0.5" value={theme.mouseRepelStrength} onChange={e => handleChange('mouseRepelStrength', parseFloat(e.target.value))} />
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Enable Click Effect</label>
                <ToggleSwitch checked={theme.clickEffectEnabled} onChange={val => handleChange('clickEffectEnabled', val)} />
            </div>
        </Section>
    );
};

const FooterEditor: React.FC<{ footer: FooterData; setFooter: (footer: FooterData) => void; }> = ({ footer, setFooter }) => {
    const handleFieldChange = (field: keyof FooterData, value: any) => {
        setFooter({ ...footer, [field]: value });
    };
    const handleSocialChange = (index: number, field: string, value: string) => {
        const newSocials = [...footer.socialLinks];
        newSocials[index] = { ...newSocials[index], [field]: value };
        handleFieldChange('socialLinks', newSocials);
    };
    const addSocial = () => handleFieldChange('socialLinks', [...footer.socialLinks, {name: 'New Social', url: '#', icon: 'link'}]);
    const removeSocial = (index: number) => handleFieldChange('socialLinks', footer.socialLinks.filter((_, i) => i !== index));

    return (
        <div>
            <Section title="Footer Content">
                <FormInput label="About Text" value={footer.aboutText} onChange={e => handleFieldChange('aboutText', e.target.value)} />
                <FormInput label="Email" value={footer.email} onChange={e => handleFieldChange('email', e.target.value)} />
                <FormInput label="Phone" value={footer.phone} onChange={e => handleFieldChange('phone', e.target.value)} />
                <FormInput label="Address" value={footer.address} onChange={e => handleFieldChange('address', e.target.value)} />
            </Section>
            <Section title="Social Links">
                <div className="space-y-4">
                    {footer.socialLinks.map((social, index) => (
                        <div key={index} className="flex items-end gap-2 p-2 border rounded bg-gray-50">
                            <FormInput label="Name" value={social.name} onChange={e => handleSocialChange(index, 'name', e.target.value)} />
                            <FormInput label="URL" value={social.url} onChange={e => handleSocialChange(index, 'url', e.target.value)} />
                            <FormInput label="Icon" value={social.icon} onChange={e => handleSocialChange(index, 'icon', e.target.value)} />
                            <button onClick={() => removeSocial(index)} className="px-3 py-2 bg-red-500 text-white rounded-md h-10 hover:bg-red-600">X</button>
                        </div>
                    ))}
                </div>
                <button onClick={addSocial} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Social Link</button>
            </Section>
        </div>
    );
};

const CrudEditor: React.FC<{title: string, items: any[], setItems: (items: any[]) => void}> = ({ title, items, setItems }) => {
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const handleSave = (itemToSave: any) => {
        const isNew = !items.find(i => i.id === itemToSave.id);
        if(isNew) {
            setItems([itemToSave, ...items]);
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
        const newItem = JSON.parse(JSON.stringify(items[0]));
        Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'string') newItem[key] = '';
            if (typeof newItem[key] === 'boolean') newItem[key] = false;
            if (Array.isArray(newItem[key])) newItem[key] = [];
        });
        newItem.id = `${title.toLowerCase()}_${Date.now()}`;
        if(newItem.name !== undefined) newItem.name = "New " + title;
        if(newItem.title !== undefined) newItem.title = "New " + title;
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

const LeadersEditor: React.FC<{leaders: AppData['leaders'], setLeaders: (leaders: AppData['leaders']) => void}> = ({ leaders, setLeaders }) => (
    <div>
        <Section title="Moderator Panel"><CrudEditor title="Moderator" items={leaders.moderators} setItems={items => setLeaders({...leaders, moderators: items})} /></Section>
        <Section title="Current Executive Panel"><CrudEditor title="Current Executive" items={leaders.currentExecutives} setItems={items => setLeaders({...leaders, currentExecutives: items})} /></Section>
        <Section title="Past Executive Panel"><CrudEditor title="Past Executive" items={leaders.pastExecutives} setItems={items => setLeaders({...leaders, pastExecutives: items})} /></Section>
    </div>
);

const EditModal: React.FC<{item: any, onSave: (item: any) => void, onClose: () => void}> = ({ item, onSave, onClose }) => {
    const [currentItem, setCurrentItem] = useState(item);

    const handleChange = (key: string, value: any) => {
        setCurrentItem((prev: any) => ({...prev, [key]: value}));
    };

    const renderField = (key: string, value: any) => {
        if (key === 'id') return null;
        const label = getHumanLabel(key);
        
        if (key.toLowerCase().includes('imageurl') || key.toLowerCase().includes('coverimage')) {
            return <ImagePreviewInput key={key} label={label} value={value} onChange={(e) => handleChange(key, e.target.value)} />;
        }
        if (key === 'date') {
            return <FormInput key={key} label={label} type="date" value={value} onChange={(e) => handleChange(key, e.target.value)} />;
        }
         if (key === 'time' || key.toLowerCase().includes('time24')) {
            return <FormInput key={key} label={label} type="time" value={value} onChange={(e) => handleChange(key, e.target.value)} />;
        }
        if (typeof value === 'boolean') {
            return <div key={key} className="flex items-center gap-4"><label className="block text-sm font-medium text-gray-700">{label}</label><FormInput type="toggle" checked={value} onChange={(val: boolean) => handleChange(key, val)} /></div>;
        }
        if (key.toLowerCase().includes('desc') || key.toLowerCase().includes('text') || key === 'bio') {
             return <FormInput key={key} label={label} type="richtext" value={value} onChange={(val: string) => handleChange(key, val)} />;
        }
        if (typeof value === 'string' || typeof value === 'number') {
            const isLongText = typeof value === 'string' && value.length > 80;
            return <FormInput key={key} label={label} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)} type={isLongText ? 'textarea' : 'text'} rows={isLongText ? 4 : 1} />;
        }
        if (Array.isArray(value)) {
             if (value.every(v => typeof v === 'string')) {
                return <FormInput key={key} label={`${label} (one per line)`} type="textarea" rows={4} value={value.join('\n')} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(key, e.target.value.split('\n').filter(l => l))} />;
            }
            return <FormInput key={key} label={`${label} (JSON format)`} type="textarea" rows={6} value={JSON.stringify(value, null, 2)} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { try { handleChange(key, JSON.parse(e.target.value)) } catch (err) { console.error("Invalid JSON") } }} />;
        }
       return null;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-2xl shadow-xl relative max-h-[90vh] flex flex-col">
                 <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-bold">Edit {item.name || item.title}</h3>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                </header>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {Object.entries(currentItem).map(([key, value]) => renderField(key, value))}
                </div>
                <footer className="p-4 border-t flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                    <button onClick={() => onSave(currentItem)} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">Save</button>
                </footer>
            </motion.div>
        </motion.div>
    )
}

export default AdminPage;