import React, { useMemo, useState, useEffect } from 'react';
import type { AppData } from '../../types';
import RichTextEditor from './RichTextEditor';
import ImageUploadInput from './ImageUploadInput';
import { updateConfigDoc } from '../../services/firebaseService';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';

interface EditorProps {
    appData: AppData;
    onDataChange: React.Dispatch<React.SetStateAction<AppData | null>>;
}

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const FormInput: React.FC<any> = ({ label, value, onChange, type = 'text', ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            {...props} 
        />
    </div>
);

const TextAreaInput: React.FC<any> = ({ label, value, onChange, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea 
            value={value} 
            onChange={onChange} 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            {...props} 
        />
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; description?: string }> = ({ title, children, description }) => (
    <div className="mb-6">
        <h3 className="text-xl font-bold mb-1 border-b pb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        <div className="space-y-4 pt-2">{children}</div>
    </div>
);


const DashboardEditor: React.FC<EditorProps> = ({ appData, onDataChange }) => {
    const [originalData, setOriginalData] = useState(() => deepClone(appData));
    const [draftData, setDraftData] = useState(() => deepClone(appData));
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();
    
    useEffect(() => {
        setOriginalData(deepClone(appData));
        setDraftData(deepClone(appData));
    }, [appData]);

    const hasChanges = useMemo(() => {
        const keys: (keyof AppData)[] = ['hero', 'about', 'join'];
        return keys.some(key => JSON.stringify(draftData[key]) !== JSON.stringify(originalData[key]));
    }, [draftData, originalData]);

    const handleReset = () => {
        setDraftData(deepClone(originalData));
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const promises = [];
            if(JSON.stringify(draftData.hero) !== JSON.stringify(originalData.hero)) {
                promises.push(updateConfigDoc('hero', draftData.hero));
            }
            if(JSON.stringify(draftData.about) !== JSON.stringify(originalData.about)) {
                promises.push(updateConfigDoc('about', draftData.about));
            }
            if(JSON.stringify(draftData.join) !== JSON.stringify(originalData.join)) {
                promises.push(updateConfigDoc('join', draftData.join));
            }
            await Promise.all(promises);
            
            const newOriginalData = deepClone(draftData);
            setOriginalData(newOriginalData);
            onDataChange(newOriginalData); // Update parent state
            
            addToast('Dashboard content saved!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Error saving dashboard content.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (section: 'hero' | 'about' | 'join', field: string, value: any) => {
        setDraftData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    };

    return (
        <div>
             <div className="mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold">Dashboard</h2>
            </div>
            
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{draftData.departments.length}</p>
                    <p className="text-sm font-medium text-blue-800">Departments</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{draftData.events.length}</p>
                    <p className="text-sm font-medium text-green-800">Events</p>
                </div>
                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-yellow-600">{draftData.achievements.length}</p>
                    <p className="text-sm font-medium text-yellow-800">Achievements</p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-indigo-600">{draftData.leaders.moderators.length + draftData.leaders.currentExecutives.length + draftData.leaders.pastExecutives.length}</p>
                    <p className="text-sm font-medium text-indigo-800">Leaders</p>
                </div>
            </div>
            <Section title="Hero Section">
                <FormInput label="Headline" value={draftData.hero.headline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'headline', e.target.value)} />
                <FormInput label="Tagline" value={draftData.hero.tagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'tagline', e.target.value)} />
            </Section>
            <Section title="About Section">
                <TextAreaInput label="Short Text" rows={3} value={draftData.about.shortText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('about', 'shortText', e.target.value)} />
                <RichTextEditor label="Full Text" value={draftData.about.fullText} onChange={(val: string) => handleFieldChange('about', 'fullText', val)} />
                <ImageUploadInput label="Image URL" value={draftData.about.imageUrl} onChange={(val: string) => handleFieldChange('about', 'imageUrl', val)} />
                <FormInput label="Video URL" value={draftData.about.videoUrl || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('about', 'videoUrl', e.target.value)} />
                <FormInput label="Vision Tagline" value={draftData.about.visionTagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('about', 'visionTagline', e.target.value)} />
            </Section>
             <Section title="Join Us Section">
                <FormInput label="Title" value={draftData.join.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'title', e.target.value)} />
                <TextAreaInput label="Description" rows={3} value={draftData.join.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'description', e.target.value)} />
                <FormInput label="Button Text" value={draftData.join.buttonText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'buttonText', e.target.value)} />
                <FormInput label="Button Link" value={draftData.join.buttonLink} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'buttonLink', e.target.value)} />
            </Section>

            <AnimatePresence>
                {hasChanges && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="sticky bottom-4 z-20 flex justify-center"
                    >
                         <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-full flex items-center gap-2 p-2 border">
                            <button onClick={handleReset} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-full font-semibold">Reset</button>
                            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold w-28">{isSaving ? 'Saving...' : 'Save'}</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardEditor;