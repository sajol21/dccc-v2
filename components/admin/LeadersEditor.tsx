
import React from 'react';
import type { LeadersData, Moderator, Executive } from '../../types';
import CrudEditor from './CrudEditor';

interface EditorProps {
    leaders: LeadersData;
    setLeaders: (leaders: LeadersData) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8 p-4 border rounded-md bg-gray-50/50">
        {children}
    </div>
);

const LeadersEditor: React.FC<EditorProps> = ({ leaders, setLeaders }) => {

    const handleLeadersChange = (key: keyof LeadersData, value: any) => {
        setLeaders({
            ...leaders,
            [key]: value,
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Leaders Panels</h2>

            <Section title="Moderator Panel">
                <CrudEditor<Moderator> 
                    title="Moderator" 
                    items={leaders.moderators} 
                    setItems={(newItems) => handleLeadersChange('moderators', newItems)}
                />
            </Section>
            
            <Section title="Current Executive Panel">
                 <CrudEditor<Executive> 
                    title="Current Executive" 
                    items={leaders.currentExecutives} 
                    setItems={(newItems) => handleLeadersChange('currentExecutives', newItems)}
                />
            </Section>
            
            <Section title="Past Executive Panel">
                 <CrudEditor<Executive> 
                    title="Past Executive" 
                    items={leaders.pastExecutives}
                    setItems={(newItems) => handleLeadersChange('pastExecutives', newItems)}
                />
            </Section>
        </div>
    );
};

export default LeadersEditor;
