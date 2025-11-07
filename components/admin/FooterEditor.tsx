
import React from 'react';
import type { FooterData } from '../../types';
import ArrayOfObjectsEditor from './ArrayOfObjectsEditor';
import ImageUploadInput from './ImageUploadInput';

interface EditorProps {
    footer: FooterData;
    onChange: (newFooter: FooterData) => void;
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


const FooterEditor: React.FC<EditorProps> = ({ footer, onChange }) => {
    
    const handleFieldChange = (field: keyof FooterData, value: any) => {
        onChange({ ...footer, [field]: value });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Footer Settings</h2>
            
            <div className="space-y-4">
                 <ImageUploadInput label="Logo 1 URL" value={footer.logo1Url} onChange={(val: string) => handleFieldChange('logo1Url', val)} />
                 <ImageUploadInput label="Logo 2 URL" value={footer.logo2Url} onChange={(val: string) => handleFieldChange('logo2Url', val)} />
                 <FormInput label="About Text" value={footer.aboutText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('aboutText', e.target.value)} />
                 <FormInput label="Email" value={footer.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', e.target.value)} />
                 <FormInput label="Phone" value={footer.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('phone', e.target.value)} />
                 <FormInput label="Address" value={footer.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('address', e.target.value)} />
                 <FormInput label="Copyright Text" value={footer.copyrightText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('copyrightText', e.target.value)} />
                
                 <ArrayOfObjectsEditor 
                    label="Social Links" 
                    value={footer.socialLinks} 
                    onChange={(val: any[]) => handleFieldChange('socialLinks', val)}
                />
            </div>

        </div>
    );
};

export default FooterEditor;