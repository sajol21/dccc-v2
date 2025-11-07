
import React from 'react';
import type { LeadersData, Moderator, Executive } from '../../types';
import CrudEditor from './CrudEditor';
import EditorWrapper from './EditorWrapper';
import { getLeaders, saveLeaders } from '../../services/firebaseService';

interface FormProps {
    data: LeadersData;
    onChange: (leaders: LeadersData) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8 p-4 border rounded-md bg-gray-50/50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        {children}
    </div>
);

const LeadersForm: React.FC<FormProps> = ({ data, onChange }) => {

    const handleLeadersChange = (key: keyof LeadersData, value: any) => {
        onChange({
            ...data,
            [key]: value,
        });
    };

    return (
        <div className="space-y-8">
            <Section title="Moderator Panel">
                <CrudEditor<Moderator> 
                    title="Moderator" 
                    items={data.moderators} 
                    setItems={(newItems) => handleLeadersChange('moderators', newItems)}
                />
            </Section>
            
            <Section title="Current Executive Panel">
                 <CrudEditor<Executive> 
                    title="Current Executive" 
                    items={data.currentExecutives} 
                    setItems={(newItems) => handleLeadersChange('currentExecutives', newItems)}
                />
            </Section>
            
            <Section title="Past Executive Panel">
                 <CrudEditor<Executive> 
                    title="Past Executive" 
                    items={data.pastExecutives}
                    setItems={(newItems) => handleLeadersChange('pastExecutives', newItems)}
                />
            </Section>
        </div>
    );
};


const LeadersEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="Leaders Panels"
            description="Manage all moderator and executive panels from here."
            fetcher={getLeaders}
            saver={saveLeaders}
// FIX: Pass children as an explicit prop to satisfy TypeScript
            children={(data, setData) => <LeadersForm data={data} onChange={setData} />}
        />
    );
};

export default LeadersEditor;