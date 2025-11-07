
import React from 'react';
import type { HeroData, AboutData, JoinData } from '../../types';
import RichTextEditor from './RichTextEditor';
import ImageUploadInput from './ImageUploadInput';
import EditorWrapper from './EditorWrapper';
import { getDashboardData, saveDashboardData } from '../../services/firebaseService';

interface FormProps {
    data: {
        hero: HeroData;
        about: AboutData;
        join: JoinData;
    };
    onChange: (newData: any) => void;
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


const DashboardForm: React.FC<FormProps> = ({ data, onChange }) => {

    const handleFieldChange = (section: 'hero' | 'about' | 'join', field: string, value: any) => {
        onChange({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    return (
        <div>
            <Section title="Hero Section">
                <FormInput label="Headline Line 1" value={data.hero.headlineLine1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'headlineLine1', e.target.value)} />
                <FormInput label="Headline Line 2" value={data.hero.headlineLine2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'headlineLine2', e.target.value)} />
                <FormInput label="Tagline" value={data.hero.tagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'tagline', e.target.value)} />
            </Section>

            <Section title="About Section">
                <TextAreaInput label="Short Text" rows={3} value={data.about.shortText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('about', 'shortText', e.target.value)} />
                <RichTextEditor label="Full Text" value={data.about.fullText} onChange={(val: string) => handleFieldChange('about', 'fullText', val)} />
                <ImageUploadInput label="Image URL" value={data.about.imageUrl} onChange={(val: string) => handleFieldChange('about', 'imageUrl', val)} />
                <FormInput label="Video URL" value={data.about.videoUrl || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('about', 'videoUrl', e.target.value)} />
                <FormInput label="Vision Tagline" value={data.about.visionTagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('about', 'visionTagline', e.target.value)} />
            </Section>

             <Section title="Join Us Section">
                <FormInput label="Title" value={data.join.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'title', e.target.value)} />
                <TextAreaInput label="Description" rows={3} value={data.join.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'description', e.target.value)} />
                <FormInput label="Button Text" value={data.join.buttonText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'buttonText', e.target.value)} />
                <FormInput label="Button Link" value={data.join.buttonLink} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('join', 'buttonLink', e.target.value)} />
                <ImageUploadInput label="Background Image URL" value={data.join.backgroundImageUrl} onChange={(val: string) => handleFieldChange('join', 'backgroundImageUrl', val)} />
            </Section>
        </div>
    );
};

const DashboardEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="Dashboard"
            description="Manage the main content of your homepage and about page."
            fetcher={getDashboardData}
            saver={saveDashboardData}
// FIX: Pass children as an explicit prop to satisfy TypeScript
            children={(data, setData) => <DashboardForm data={data} onChange={setData} />}
        />
    );
};


export default DashboardEditor;