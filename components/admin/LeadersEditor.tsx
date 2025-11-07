import React, { useMemo } from 'react';
import type { AppData } from '../../types';
import CrudEditor from './CrudEditor';

interface EditorProps {
    originalData: AppData;
    draftData: AppData;
    setDraftData: (data: AppData) => void;
    handleSave: () => Promise<void>;
    isSaving: boolean;
    saveMessage: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8 p-4 border rounded-md bg-gray-50/50">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">{title}</h3>
        {children}
    </div>
);

const LeadersEditor: React.FC<EditorProps> = ({ originalData, draftData, setDraftData, handleSave, isSaving, saveMessage }) => {

    const handleLeadersChange = (key: keyof AppData['leaders'], value: any) => {
        setDraftData({
            ...draftData,
            leaders: {
                ...draftData.leaders,
                [key]: value,
            },
        });
    };

    const hasChanges = useMemo(() => {
        return JSON.stringify(draftData.leaders) !== JSON.stringify(originalData.leaders);
    }, [draftData.leaders, originalData.leaders]);

    const handleReset = () => {
        setDraftData({
            ...draftData,
            leaders: JSON.parse(JSON.stringify(originalData.leaders)),
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold">Leaders Panels</h2>
                 <div className="flex items-center gap-2">
                    <button onClick={handleReset} disabled={!hasChanges || isSaving} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50">Reset All</button>
                    <button onClick={handleSave} disabled={!hasChanges || isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Saving All...' : 'Save All Changes'}</button>
                </div>
            </div>

            <Section title="Moderator Panel">
                <CrudEditor 
                    title="Moderator" 
                    dataKey="leaders.moderators"
                    originalData={{'leaders.moderators': originalData.leaders.moderators} as any}
                    draftData={{'leaders.moderators': draftData.leaders.moderators} as any}
                    setDraftData={(d) => handleLeadersChange('moderators', d['leaders.moderators'])}
                    handleSave={handleSave}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                />
            </Section>
            
            <Section title="Current Executive Panel">
                 <CrudEditor 
                    title="Current Executive" 
                    dataKey="leaders.currentExecutives"
                    originalData={{'leaders.currentExecutives': originalData.leaders.currentExecutives} as any}
                    draftData={{'leaders.currentExecutives': draftData.leaders.currentExecutives} as any}
                    setDraftData={(d) => handleLeadersChange('currentExecutives', d['leaders.currentExecutives'])}
                    handleSave={handleSave}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                />
            </Section>
            
            <Section title="Past Executive Panel">
                 <CrudEditor 
                    title="Past Executive" 
                    dataKey="leaders.pastExecutives"
                    originalData={{'leaders.pastExecutives': originalData.leaders.pastExecutives} as any}
                    draftData={{'leaders.pastExecutives': draftData.leaders.pastExecutives} as any}
                    setDraftData={(d) => handleLeadersChange('pastExecutives', d['leaders.pastExecutives'])}
                    handleSave={handleSave}
                    isSaving={isSaving}
                    saveMessage={saveMessage}
                />
            </Section>
        </div>
    );
};

export default LeadersEditor;
