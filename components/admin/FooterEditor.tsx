import React, { useMemo, useState, useEffect } from 'react';
import type { AppData } from '../../types';
import ArrayOfObjectsEditor from './ArrayOfObjectsEditor';
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


const FooterEditor: React.FC<EditorProps> = ({ appData, onDataChange }) => {
    const [originalFooter, setOriginalFooter] = useState(() => deepClone(appData.footer));
    const [draftFooter, setDraftFooter] = useState(() => deepClone(appData.footer));
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();
    
    useEffect(() => {
        setOriginalFooter(deepClone(appData.footer));
        setDraftFooter(deepClone(appData.footer));
    }, [appData.footer]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(draftFooter) !== JSON.stringify(originalFooter);
    }, [draftFooter, originalFooter]);

    const handleReset = () => {
        setDraftFooter(deepClone(originalFooter));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfigDoc('footer', draftFooter);
            setOriginalFooter(deepClone(draftFooter));
            onDataChange(prev => prev ? { ...prev, footer: deepClone(draftFooter) } : null);
            addToast('Footer saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Error saving footer.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleFieldChange = (field: keyof AppData['footer'], value: any) => {
        setDraftFooter(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
             <div className="mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold">Footer Settings</h2>
            </div>
            
            <div className="space-y-4">
                 <ImageUploadInput label="Logo 1 URL" value={draftFooter.logo1Url} onChange={(val: string) => handleFieldChange('logo1Url', val)} />
                 <ImageUploadInput label="Logo 2 URL" value={draftFooter.logo2Url} onChange={(val: string) => handleFieldChange('logo2Url', val)} />
                 <FormInput label="About Text" value={draftFooter.aboutText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('aboutText', e.target.value)} />
                 <FormInput label="Email" value={draftFooter.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', e.target.value)} />
                 <FormInput label="Phone" value={draftFooter.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('phone', e.target.value)} />
                 <FormInput label="Address" value={draftFooter.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('address', e.target.value)} />
                 <FormInput label="Copyright Text" value={draftFooter.copyrightText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('copyrightText', e.target.value)} />
                
                 <ArrayOfObjectsEditor 
                    label="Social Links" 
                    value={draftFooter.socialLinks} 
                    onChange={(val: any[]) => handleFieldChange('socialLinks', val)}
                />
            </div>
            
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

export default FooterEditor;