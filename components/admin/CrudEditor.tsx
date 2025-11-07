import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import EditModal from './EditModal';
import type { AppData } from '../../types';

interface CrudEditorProps {
    title: string;
    // FIX: Changed dataKey to string to allow for nested keys.
    dataKey: string;
    // FIX: Changed data types to any to allow for partial data objects.
    originalData: any;
    draftData: any;
    setDraftData: (data: any) => void;
    handleSave: () => Promise<void>;
    isSaving: boolean;
    saveMessage: string;
}

const SectionHeader: React.FC<{
    title: string;
    hasChanges: boolean;
    onSave: () => void;
    onReset: () => void;
    onAdd: () => void;
    isSaving: boolean;
    saveMessage: string;
}> = ({ title, hasChanges, onSave, onReset, onAdd, isSaving, saveMessage }) => (
    <div className="mb-6 pb-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex items-center gap-2">
                <button
                    onClick={onReset}
                    disabled={!hasChanges || isSaving}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                    Reset
                </button>
                <div className="relative">
                     <button
                        onClick={onSave}
                        disabled={!hasChanges || isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors w-28"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <AnimatePresence>
                        {saveMessage && (
                            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute -bottom-6 right-0 text-xs font-semibold text-gray-600 whitespace-nowrap">{saveMessage}</motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <button onClick={onAdd} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors shadow">
                    Add New
                </button>
            </div>
        </div>
    </div>
);


const CrudEditor: React.FC<CrudEditorProps> = ({ title, dataKey, originalData, draftData, setDraftData, handleSave, isSaving, saveMessage }) => {
    const [editingItem, setEditingItem] = useState<any | null>(null);

    const items = draftData[dataKey] as any[];
    const originalItems = originalData[dataKey] as any[];
    
    const hasChanges = useMemo(() => JSON.stringify(items) !== JSON.stringify(originalItems), [items, originalItems]);

    const handleUpdate = (newItems: any[]) => {
        setDraftData({ ...draftData, [dataKey]: newItems });
    };

    const handleReset = () => {
        handleUpdate(JSON.parse(JSON.stringify(originalItems)));
    }
    
    const handleSaveItem = (itemToSave: any) => {
        const isNew = !items.find(i => i.id === itemToSave.id);
        if(isNew) {
            handleUpdate([itemToSave, ...items]);
        } else {
            handleUpdate(items.map(i => i.id === itemToSave.id ? itemToSave : i));
        }
        setEditingItem(null);
    };

    const handleCreate = () => {
        if (items.length === 0) {
            setEditingItem({id: `${title.toLowerCase()}_${Date.now()}`});
            return;
        }
        const newItem = JSON.parse(JSON.stringify(items[0]));
        Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'string') newItem[key] = '';
            if (typeof newItem[key] === 'boolean') newItem[key] = false;
            if (Array.isArray(newItem[key])) newItem[key] = [];
            if (typeof newItem[key] === 'number') newItem[key] = 0;
            if (typeof newItem[key] === 'object' && newItem[key] !== null && !Array.isArray(newItem[key])) newItem[key] = {};
        });
        newItem.id = `${title.toLowerCase().replace(' ', '-')}_${Date.now()}`;
        if(newItem.name !== undefined) newItem.name = "New " + title;
        if(newItem.title !== undefined) newItem.title = "New " + title;
        setEditingItem(newItem);
    };

    const handleDelete = (id: string) => {
        if(window.confirm(`Are you sure you want to delete this ${title}?`)) {
            handleUpdate(items.filter(i => i.id !== id));
        }
    };

    return (
        <div>
            <SectionHeader 
                title={`${title}s`}
                hasChanges={hasChanges}
                onSave={handleSave}
                onReset={handleReset}
                onAdd={handleCreate}
                isSaving={isSaving}
                saveMessage={saveMessage}
            />
            <Reorder.Group axis="y" values={items} onReorder={handleUpdate}>
                <div className="space-y-2">
                    {items.map(item => (
                         <Reorder.Item key={item.id} value={item}>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border cursor-grab active:cursor-grabbing">
                                <p className="font-medium">{item.name || item.title}</p>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </div>
            </Reorder.Group>
            {items.length === 0 && <p className="text-gray-500 text-center py-8">No {title}s yet. Click "Add New" to create one.</p>}

            <AnimatePresence>
                {editingItem && <EditModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CrudEditor;