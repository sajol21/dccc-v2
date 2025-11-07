

import React from 'react';
import type { ThemeData } from '../../types';
import EditorWrapper from './EditorWrapper';
import { getTheme, saveTheme } from '../../services/firebaseService';

interface FormProps {
    data: ThemeData;
    onChange: (newTheme: ThemeData) => void;
}

const FormInput: React.FC<any> = ({ label, value, onChange, type = 'text', ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition h-10 px-3" 
            {...props} 
        />
    </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)} className={`${checked ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0`}>
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);

const ThemeForm: React.FC<FormProps> = ({ data, onChange }) => {
    
    const handleChange = (field: keyof ThemeData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-4">
            <FormInput label="Background Color" type="color" value={data.backgroundColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('backgroundColor', e.target.value)} />
            <FormInput label="Node Color" type="color" value={data.nodeColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeColor', e.target.value)} />
            <FormInput label="Line Color" type="color" value={data.lineColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lineColor', e.target.value)} />
            <FormInput label="Highlight Color" type="color" value={data.highlightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('highlightColor', e.target.value)} />
            <FormInput label="Line Highlight Color" type="color" value={data.lineHighlightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('lineHighlightColor', e.target.value)} />
            <FormInput label={`Node Density (${data.nodeDensity})`} type="range" min="5000" max="20000" step="100" value={data.nodeDensity} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeDensity', parseInt(e.target.value))} />
            <FormInput label={`Node Size (${data.nodeSize})`} type="range" min="1" max="5" step="0.1" value={data.nodeSize} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('nodeSize', parseFloat(e.target.value))} />
            <FormInput label={`Mouse Repel Strength (${data.mouseRepelStrength})`} type="range" min="0" max="10" step="0.5" value={data.mouseRepelStrength} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('mouseRepelStrength', parseFloat(e.target.value))} />
            <div className="flex items-center gap-4 pt-2">
                <label className="text-sm font-medium text-gray-700">Enable Click Effect</label>
                <ToggleSwitch checked={data.clickEffectEnabled} onChange={val => handleChange('clickEffectEnabled', val)} />
            </div>
        </div>
    );
};


const ThemeEditor: React.FC = () => {
     return (
        <EditorWrapper
            title="Theme & Animation"
            description="Customize the interactive mesh on the homepage."
            fetcher={getTheme}
            saver={saveTheme}
            // FIX: Pass children as an explicit prop to satisfy TypeScript.
            children={(data, setData) => <ThemeForm data={data} onChange={setData} />}
        />
    );
};

export default ThemeEditor;