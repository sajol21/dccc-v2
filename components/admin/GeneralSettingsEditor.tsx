
import React from 'react';
import type { GeneralSettingsData } from '../../types';
import ImageUploadInput from './ImageUploadInput';
import EditorWrapper from './EditorWrapper';
import { getGeneralSettings, saveGeneralSettings } from '../../services/firebaseService';

interface FormProps {
    data: GeneralSettingsData;
    onChange: (newData: GeneralSettingsData) => void;
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

const GeneralSettingsForm: React.FC<FormProps> = ({ data, onChange }) => {

    const handleFieldChange = (field: keyof GeneralSettingsData, value: string) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    return (
        <div className="space-y-6 max-w-lg">
            <FormInput 
                label="Site Name" 
                value={data.siteName} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('siteName', e.target.value)} 
            />
             <ImageUploadInput 
                label="Site Logo URL" 
                value={data.siteLogoUrl} 
                onChange={(val: string) => handleFieldChange('siteLogoUrl', val)} 
            />
             <ImageUploadInput 
                label="Favicon URL" 
                value={data.faviconUrl} 
                onChange={(val: string) => handleFieldChange('faviconUrl', val)} 
            />
        </div>
    );
};

const GeneralSettingsEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="General Settings"
            description="Manage site-wide settings like name, logo, and favicon."
            fetcher={getGeneralSettings}
            saver={saveGeneralSettings}
            children={(data, setData) => <GeneralSettingsForm data={data} onChange={setData} />}
        />
    );
};

export default GeneralSettingsEditor;
