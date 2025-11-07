import React, { useMemo, useState, useEffect } from 'react';
import type { AppData } from '../../types';
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

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)} className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0`}>
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

const ThemeEditor: React.FC<EditorProps> = ({ appData, onDataChange }) => {
    const [originalTheme, setOriginalTheme] = useState(() => deepClone(appData.theme));
    const [draftTheme, setDraftTheme] = useState(() => deepClone(appData.theme));
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        setOriginalTheme(deepClone(appData.theme));
        setDraftTheme(deepClone(appData.theme));
    }, [appData.theme]);
    
    const hasChanges = useMemo(() => {
        return JSON.stringify(draftTheme) !== JSON.stringify(originalTheme);
    }, [draftTheme, originalTheme]);

    const handleReset = () => {
        setDraftTheme(deepClone(originalTheme));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateConfigDoc('theme', draftTheme);
            setOriginalTheme(deepClone(draftTheme));
            onDataChange(prev => prev ? { ...prev, theme: deepClone(draftTheme) } : null);
            addToast('Theme saved successfully!', 'success');
        } catch(error) {
            console.error(error);
            addToast('Error saving theme.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: keyof AppData['theme'], value: any) => {
        setDraftTheme(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div>
            <div className="mb-6 pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">Theme & Animation</h2>
                    <p className="text-sm text-gray-500">Customize the interactive mesh on the homepage.</p>
                </div>
            </div>

            <div className="space-y-4">
                <FormInput label="Background Color" type="color" value={draftTheme.backgroundColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('backgroundColor', e.target.value)} />
                <FormInput label="Node Color" type="color" value={draftTheme.nodeColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeColor', e.target.value)} />
                <FormInput label="Line Color" type="color" value={draftTheme.lineColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lineColor', e.target.value)} />
                <FormInput label="Highlight Color" type="color" value={draftTheme.highlightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('highlightColor', e.target.value)} />
                <FormInput label="Line Highlight Color" type="color" value={draftTheme.lineHighlightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lineHighlightColor', e.target.value)} />
                <FormInput label={`Node Density (${draftTheme.nodeDensity})`} type="range" min="5000" max="20000" step="100" value={draftTheme.nodeDensity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeDensity', parseInt(e.target.value))} />
                <FormInput label={`Node Size (${draftTheme.nodeSize})`} type="range" min="1" max="5" step="0.1" value={draftTheme.nodeSize} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeSize', parseFloat(e.target.value))} />
                <FormInput label={`Mouse Repel Strength (${draftTheme.mouseRepelStrength})`} type="range" min="0" max="10" step="0.5" value={draftTheme.mouseRepelStrength} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('mouseRepelStrength', parseFloat(e.target.value))} />
                <div className="flex items-center gap-4 pt-2">
                    <label className="text-sm font-medium text-gray-700">Enable Click Effect</label>
                    <ToggleSwitch checked={draftTheme.clickEffectEnabled} onChange={val => handleChange('clickEffectEnabled', val)} />
                </div>
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

export default ThemeEditor;