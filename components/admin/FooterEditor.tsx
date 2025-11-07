

import React from 'react';
import type { FooterData } from '../../types';
import ArrayOfObjectsEditor from './ArrayOfObjectsEditor';
import ImageUploadInput from './ImageUploadInput';
import EditorWrapper from './EditorWrapper';
import { getFooter, saveFooter } from '../../services/firebaseService';

interface FormProps {
    data: FooterData;
    onChange: (newFooter: FooterData) => void;
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


const FooterForm: React.FC<FormProps> = ({ data, onChange }) => {
    
    const handleFieldChange = (field: keyof FooterData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="space-y-4">
             <ImageUploadInput label="Logo 1 URL" value={data.logo1Url} onChange={(val: string) => handleFieldChange('logo1Url', val)} />
             <ImageUploadInput label="Logo 2 URL" value={data.logo2Url} onChange={(val: string) => handleFieldChange('logo2Url', val)} />
             <FormInput label="About Text" value={data.aboutText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('aboutText', e.target.value)} />
             <FormInput label="Email" value={data.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', e.target.value)} />
             <FormInput label="Phone" value={data.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('phone', e.target.value)} />
             <FormInput label="Address" value={data.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('address', e.target.value)} />
             <FormInput label="Copyright Text" value={data.copyrightText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('copyrightText', e.target.value)} />
            
             <ArrayOfObjectsEditor 
                label="Social Links" 
                value={data.socialLinks} 
                onChange={(val: any[]) => handleFieldChange('socialLinks', val)}
            />
        </div>
    );
};

const FooterEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="Footer Settings"
            description="Manage the content displayed in the website footer."
            fetcher={getFooter}
            saver={saveFooter}
            // FIX: Pass children as an explicit prop to satisfy TypeScript.
            children={(data, setData) => <FooterForm data={data} onChange={setData} />}
        />
    );
}

export default FooterEditor;