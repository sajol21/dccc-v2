
import React from 'react';
import type { HeroData, JoinData } from '../../types';
import ImageUploadInput from './ImageUploadInput';
import EditorWrapper from './EditorWrapper';
import { getHomePageContent, saveHomePageContent } from '../../services/firebaseService';

interface FormProps {
    data: {
        hero: HeroData;
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

const Section: React.FC<{ title: string; children: React.ReactNode; description?: string }> = ({ title, children, description }) => (
    <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-xl font-bold mb-1 text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        <div className="space-y-4 pt-4 border-t">{children}</div>
    </div>
);


const HomePageForm: React.FC<FormProps> = ({ data, onChange }) => {

    const handleFieldChange = (section: 'hero' | 'join', field: string, value: any) => {
        onChange({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };
    
    const handleFeaturedEventsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const ids = e.target.value.split(',').map(id => id.trim()).filter(Boolean);
        handleFieldChange('hero', 'featuredEventIds', ids);
    }

    return (
        <div>
            <Section title="Hero Section">
                <FormInput label="Headline Line 1" value={data.hero.headlineLine1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'headlineLine1', e.target.value)} />
                <FormInput label="Headline Line 2" value={data.hero.headlineLine2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'headlineLine2', e.target.value)} />
                <FormInput label="Tagline" value={data.hero.tagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('hero', 'tagline', e.target.value)} />
                <ImageUploadInput label="Background Image URL" value={data.hero.backgroundImageUrl || ''} onChange={(val: string) => handleFieldChange('hero', 'backgroundImageUrl', val)} />
                <TextAreaInput 
                    label="Featured Event IDs" 
                    rows={2} 
                    value={(data.hero.featuredEventIds || []).join(', ')} 
                    onChange={handleFeaturedEventsChange}
                    placeholder="event-id-1, event-id-2"
                />
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

const HomePageEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="Home Page Content"
            description="Manage the content of your homepage hero and other sections."
            fetcher={getHomePageContent}
            saver={saveHomePageContent}
            children={(data, setData) => <HomePageForm data={data} onChange={setData} />}
        />
    );
};


export default HomePageEditor;