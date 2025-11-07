
import React from 'react';
import type { HeroData, AboutData, JoinData } from '../../types';
import RichTextEditor from './RichTextEditor';
import ImageUploadInput from './ImageUploadInput';

interface EditorProps {
    data: {
        hero: HeroData;
        about: AboutData;
        join: JoinData;
    };
    stats: {
        departments: number;
        events: number;
        achievements: number;
        leaders: number;
    }
    onChange: (section: 'hero' | 'about' | 'join', field: string, value: any) => void;
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


const DashboardEditor: React.FC<EditorProps> = ({ data, stats, onChange }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{stats.departments}</p>
                    <p className="text-sm font-medium text-blue-800">Departments</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{stats.events}</p>
                    <p className="text-sm font-medium text-green-800">Events</p>
                </div>
                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-yellow-600">{stats.achievements}</p>
                    <p className="text-sm font-medium text-yellow-800">Achievements</p>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                    <p className="text-3xl font-bold text-indigo-600">{stats.leaders}</p>
                    <p className="text-sm font-medium text-indigo-800">Leaders</p>
                </div>
            </div>

            <Section title="Hero Section">
                <FormInput label="Headline" value={data.hero.headline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('hero', 'headline', e.target.value)} />
                <FormInput label="Tagline" value={data.hero.tagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('hero', 'tagline', e.target.value)} />
            </Section>

            <Section title="About Section">
                <TextAreaInput label="Short Text" rows={3} value={data.about.shortText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('about', 'shortText', e.target.value)} />
                <RichTextEditor label="Full Text" value={data.about.fullText} onChange={(val: string) => onChange('about', 'fullText', val)} />
                <ImageUploadInput label="Image URL" value={data.about.imageUrl} onChange={(val: string) => onChange('about', 'imageUrl', val)} />
                <FormInput label="Video URL" value={data.about.videoUrl || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('about', 'videoUrl', e.target.value)} />
                <FormInput label="Vision Tagline" value={data.about.visionTagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('about', 'visionTagline', e.target.value)} />
            </Section>

             <Section title="Join Us Section">
                <FormInput label="Title" value={data.join.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('join', 'title', e.target.value)} />
                <TextAreaInput label="Description" rows={3} value={data.join.description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('join', 'description', e.target.value)} />
                <FormInput label="Button Text" value={data.join.buttonText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('join', 'buttonText', e.target.value)} />
                <FormInput label="Button Link" value={data.join.buttonLink} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('join', 'buttonLink', e.target.value)} />
            </Section>
        </div>
    );
};

export default DashboardEditor;
