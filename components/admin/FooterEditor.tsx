import React, { useMemo } from 'react';
import type { AppData } from '../../types';
import ArrayOfObjectsEditor from './ArrayOfObjectsEditor';
import ImageUploadInput from './ImageUploadInput';

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


const FooterEditor: React.FC<EditorProps> = ({ originalData, draftData, setDraftData, handleSave, isSaving }) => {
    
    const hasChanges = useMemo(() => {
        return JSON.stringify(draftData.footer) !== JSON.stringify(originalData.footer);
    }, [draftData.footer, originalData.footer]);

    const handleReset = () => {
        setDraftData({
            ...draftData,
            footer: JSON.parse(JSON.stringify(originalData.footer)),
        });
    };

    const handleFieldChange = (field: keyof AppData['footer'], value: any) => {
        setDraftData({ ...draftData, footer: { ...draftData.footer, [field]: value } });
    };

    return (
        <div>
             <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold">Footer Settings</h2>
                <div className="flex items-center gap-2">
                    <button onClick={handleReset} disabled={!hasChanges || isSaving} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50">Reset</button>
                    <button onClick={handleSave} disabled={!hasChanges || isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
            
            <div className="space-y-4">
                 <ImageUploadInput label="Logo 1 URL" value={draftData.footer.logo1Url} onChange={(val: string) => handleFieldChange('logo1Url', val)} />
                 <ImageUploadInput label="Logo 2 URL" value={draftData.footer.logo2Url} onChange={(val: string) => handleFieldChange('logo2Url', val)} />
                 <FormInput label="About Text" value={draftData.footer.aboutText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('aboutText', e.target.value)} />
                 <FormInput label="Email" value={draftData.footer.email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('email', e.target.value)} />
                 <FormInput label="Phone" value={draftData.footer.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('phone', e.target.value)} />
                 <FormInput label="Address" value={draftData.footer.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('address', e.target.value)} />
                 <FormInput label="Copyright Text" value={draftData.footer.copyrightText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('copyrightText', e.target.value)} />
                
                 <ArrayOfObjectsEditor 
                    label="Social Links" 
                    value={draftData.footer.socialLinks} 
                    onChange={(val: any[]) => handleFieldChange('socialLinks', val)}
                />
            </div>

        </div>
    );
};

export default FooterEditor;
