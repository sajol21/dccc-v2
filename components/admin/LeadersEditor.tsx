



import React from 'react';
import type { LeadersData, Moderator, Executive } from '../../types';
import CrudEditor from './CrudEditor';
import EditorWrapper from './EditorWrapper';
import { getLeaders, saveLeaders } from '../../services/firebaseService';

interface FormProps {
    data: LeadersData;
    onChange: (leaders: LeadersData) => void;
}

const LeadersForm: React.FC<FormProps> = ({ data, onChange }) => {

    const handleLeadersChange = (key: keyof LeadersData, value: any) => {
        onChange({
            ...data,
            [key]: value,
        });
    };

    return (
        <div className="space-y-12">
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Moderator Panel</h3>
                <CrudEditor<Moderator> 
                    items={data.moderators} 
                    setItems={(newItems) => handleLeadersChange('moderators', newItems)}
                />
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Current Executive Panel</h3>
                 <CrudEditor<Executive> 
                    items={data.currentExecutives} 
                    setItems={(newItems) => handleLeadersChange('currentExecutives', newItems)}
                />
            </div>
            
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Past Executive Panel</h3>
                 <CrudEditor<Executive> 
                    items={data.pastExecutives}
                    setItems={(newItems) => handleLeadersChange('pastExecutives', newItems)}
                />
            </div>
        </div>
    );
};


const LeadersEditor: React.FC = () => {
    return (
        <EditorWrapper
            title="Manage Panels"
            description="Reorder, edit, or delete members from all panels."
            fetcher={getLeaders}
            saver={saveLeaders}
            children={(data, setData) => <LeadersForm data={data} onChange={setData} />}
        />
    );
};

export default LeadersEditor;