import React, { useMemo } from 'react';
import type { AppData } from '../../types';

interface EditorProps {
    originalData: AppData;
    draftData: AppData;
    setDraftData: (data: AppData) => void;
    handleSave: () => Promise<void>;
    isSaving: boolean;
}

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

const ThemeEditor: React.FC<EditorProps> = ({ originalData, draftData, setDraftData, handleSave, isSaving }) => {
    
    const theme = draftData.theme;
    
    const hasChanges = useMemo(() => {
        return JSON.stringify(draftData.theme) !== JSON.stringify(originalData.theme);
    }, [draftData.theme, originalData.theme]);

    const handleReset = () => {
        setDraftData({
            ...draftData,
            theme: JSON.parse(JSON.stringify(originalData.theme)),
        });
    };

    const handleChange = (field: keyof AppData['theme'], value: any) => {
        setDraftData({ ...draftData, theme: { ...draftData.theme, [field]: value } });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">Theme & Animation</h2>
                    <p className="text-sm text-gray-500">Customize the interactive mesh on the homepage.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset} disabled={!hasChanges || isSaving} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50">Reset</button>
                    <button onClick={handleSave} disabled={!hasChanges || isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>

            <div className="space-y-4">
                <FormInput label="Background Color" type="color" value={theme.backgroundColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('backgroundColor', e.target.value)} />
                <FormInput label="Node Color" type="color" value={theme.nodeColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeColor', e.target.value)} />
                <FormInput label="Line Color" type="color" value={theme.lineColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lineColor', e.target.value)} />
                <FormInput label="Highlight Color" type="color" value={theme.highlightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('highlightColor', e.target.value)} />
                <FormInput label="Line Highlight Color" type="color" value={theme.lineHighlightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lineHighlightColor', e.target.value)} />
                <FormInput label={`Node Density (${theme.nodeDensity})`} type="range" min="5000" max="20000" step="100" value={theme.nodeDensity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeDensity', parseInt(e.target.value))} />
                <FormInput label={`Node Size (${theme.nodeSize})`} type="range" min="1" max="5" step="0.1" value={theme.nodeSize} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeSize', parseFloat(e.target.value))} />
                <FormInput label={`Mouse Repel Strength (${theme.mouseRepelStrength})`} type="range" min="0" max="10" step="0.5" value={theme.mouseRepelStrength} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('mouseRepelStrength', parseFloat(e.target.value))} />
                <div className="flex items-center gap-4 pt-2">
                    <label className="text-sm font-medium text-gray-700">Enable Click Effect</label>
                    <ToggleSwitch checked={theme.clickEffectEnabled} onChange={val => handleChange('clickEffectEnabled', val)} />
                </div>
            </div>
        </div>
    );
};

export default ThemeEditor;
