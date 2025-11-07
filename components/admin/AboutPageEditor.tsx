
import React from 'react';
import type { AboutData } from '../../types';
import RichTextEditor from './RichTextEditor';
import ImageUploadInput from './ImageUploadInput';
import EditorWrapper from './EditorWrapper';
import ArrayOfObjectsEditor from './ArrayOfObjectsEditor';
import { getAboutData, saveAboutData } from '../../services/firebaseService';

interface FormProps {
    data: AboutData;
    onChange: (newData: any) => void;
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

const TextAreaInput: React.FC<any> = ({ label, value, onChange, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea 
            value={value} 
            onChange={onChange} 
            className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition py-2 px-3" 
            {...props} 
        />
    </div>
);

const AboutPageForm: React.FC<FormProps> = ({ data, onChange }) => {

    const handleFieldChange = (field: keyof AboutData, value: any) => {
        onChange({
            ...data,
            [field]: value
        });
    };

    return (
        <div className="space-y-6">
            <TextAreaInput label="Short Text (for Homepage)" rows={3} value={data.shortText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('shortText', e.target.value)} />
            <RichTextEditor label="Full Text (for About Page)" value={data.fullText} onChange={(val: string) => handleFieldChange('fullText', val)} />
            <ImageUploadInput label="Image URL" value={data.imageUrl} onChange={(val: string) => handleFieldChange('imageUrl', val)} />
            <FormInput label="Video URL (for Homepage Hero)" value={data.videoUrl || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('videoUrl', e.target.value)} />
            <FormInput label="Vision Tagline" value={data.visionTagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('visionTagline', e.target.value)} />
            <FormInput label="Founded Year" type="number" value={data.foundedYear} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('foundedYear', parseInt(e.target.value, 10))} />

            <ArrayOfObjectsEditor
                label="Statistics"
                value={data.stats}
                onChange={(val: any) => handleFieldChange('stats', val)}
            />
        </div>
    );
};

const AboutPageEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="About Page Content"
            description="Manage all content related to the About page and its summary on the homepage."
            fetcher={getAboutData}
            saver={saveAboutData}
            children={(data, setData) => <AboutPageForm data={data} onChange={setData} />}
        />
    );
};


export default AboutPageEditor;