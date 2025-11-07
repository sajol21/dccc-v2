import React, { useMemo, useState, useEffect, useCallback } from 'react';
import type { AppData, Moderator, Executive } from '../../types';
import { updateConfigDoc } from '../../services/firebaseService';
import { useToast } from '../../hooks/useToast';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import EditModal from './EditModal';

interface EditorProps {
    appData: AppData;
    onDataChange: React.Dispatch<React.SetStateAction<AppData | null>>;
}

type LeaderKey = 'moderators' | 'currentExecutives' | 'pastExecutives';
type LeaderPerson = Moderator | Executive;

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));


const LeaderListEditor: React.FC<{
    title: string;
    items: LeaderPerson[];
    onUpdate: (items: LeaderPerson[]) => void;
}> = ({ title, items, onUpdate }) => {
    const [editingItem, setEditingItem] = useState<LeaderPerson | null>(null);

    const handleSaveItem = (itemToSave: LeaderPerson) => {
        const isNew = !items.find(i => i.id === itemToSave.id);
        const newItems = isNew
            ? [itemToSave, ...items]
            : items.map(i => (i.id === itemToSave.id ? itemToSave : i));
        onUpdate(newItems);
        setEditingItem(null);
    };

    const handleCreate = () => {
        const newItem: any = items.length > 0 ? deepClone(items[0]) : {};
         Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'string' && key !== 'id') newItem[key] = '';
            if (Array.isArray(newItem[key])) newItem[key] = [];
        });
        newItem.id = `${title.toLowerCase().replace(' ', '-')}_${Date.now()}`;
        newItem.name = `New ${title.slice(0,-1)}`;
        setEditingItem(newItem);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm(`Are you sure you want to delete this leader?`)) {
            onUpdate(items.filter(i => i.id !== id));
        }
    };

    return (
        <div className="mb-8 p-4 border rounded-md bg-gray-50/50">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <button onClick={handleCreate} className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">Add New</button>
            </div>
             <Reorder.Group axis="y" values={items} onReorder={onUpdate}>
                <div className="space-y-2">
                    {items.map(item => (
                         <Reorder.Item key={item.id} value={item}>
                            <div className="flex items-center justify-between p-3 bg-white rounded-md border cursor-grab active:cursor-grabbing">
                                <p className="font-medium">{item.name}</p>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </div>
            </Reorder.Group>
            {items.length === 0 && <p className="text-gray-500 text-center py-4">No leaders in this panel.</p>}
             <AnimatePresence>
                {editingItem && <EditModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
            </AnimatePresence>
        </div>
    )
};


const LeadersEditor: React.FC<EditorProps> = ({ appData, onDataChange }) => {
    const [originalLeaders, setOriginalLeaders] = useState(() => deepClone(appData.leaders));
    const [draftLeaders, setDraftLeaders] = useState(() => deepClone(appData.leaders));
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        setOriginalLeaders(deepClone(appData.leaders));
        setDraftLeaders(deepClone(appData.leaders));
    }, [appData.leaders]);

    const hasChanges = useMemo(() => {
        return JSON.stringify(draftLeaders) !== JSON.stringify(originalLeaders);
    }, [draftLeaders, originalLeaders]);

    const handleReset = () => {
        setDraftLeaders(deepClone(originalLeaders));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Add order to each item before saving
            const leadersToSave = deepClone(draftLeaders);
            leadersToSave.moderators.forEach((item: any, index: number) => item.order = index);
            leadersToSave.currentExecutives.forEach((item: any, index: number) => item.order = index);
            leadersToSave.pastExecutives.forEach((item: any, index: number) => item.order = index);

            await updateConfigDoc('leaders', leadersToSave);
            
            const newOriginalData = deepClone(draftLeaders);
            setOriginalLeaders(newOriginalData);
            onDataChange(prev => prev ? { ...prev, leaders: newOriginalData } : null);
            
            addToast('Leaders saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            addToast('Error saving leaders.', 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleListUpdate = useCallback((key: LeaderKey, items: LeaderPerson[]) => {
        setDraftLeaders(prev => ({ ...prev, [key]: items }));
    }, []);

    return (
        <div>
            <div className="mb-6 pb-4 border-b">
                <h2 className="text-2xl font-bold">Leaders Panels</h2>
            </div>
            
            <LeaderListEditor title="Moderator Panel" items={draftLeaders.moderators} onUpdate={(items) => handleListUpdate('moderators', items)} />
            <LeaderListEditor title="Current Executive Panel" items={draftLeaders.currentExecutives} onUpdate={(items) => handleListUpdate('currentExecutives', items)} />
            <LeaderListEditor title="Past Executive Panel" items={draftLeaders.pastExecutives} onUpdate={(items) => handleListUpdate('pastExecutives', items)} />

             <AnimatePresence>
                {hasChanges && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="sticky bottom-4 z-20 flex justify-center"
                    >
                         <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-full flex items-center gap-2 p-2 border">
                            <button onClick={handleReset} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded-full font-semibold">Reset</button>
                            <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold w-28">{isSaving ? 'Saving...' : 'Save'}</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeadersEditor;