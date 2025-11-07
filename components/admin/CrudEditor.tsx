import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import EditModal from './EditModal';
import { addCollectionDoc, updateCollectionDoc, deleteCollectionDoc, reorderCollection } from '../../services/firebaseService';
import { useToast } from '../../hooks/useToast';
import type { AppData } from '../../types';

type CollectionKey = 'departments' | 'events' | 'achievements';

interface CrudEditorProps {
    title: string;
    dataKey: CollectionKey;
    appData: AppData;
    onDataChange: React.Dispatch<React.SetStateAction<AppData | null>>;
}

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const ActionBar: React.FC<{ hasChanges: boolean; onSave: () => void; onReset: () => void; isSaving: boolean; }> = ({ hasChanges, onSave, onReset, isSaving }) => (
    <AnimatePresence>
        {hasChanges && (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="sticky bottom-4 z-20 flex justify-center"
            >
                <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-full flex items-center gap-2 p-2 border">
                    <button
                        onClick={onReset}
                        disabled={isSaving}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors w-28"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const CrudEditor: React.FC<CrudEditorProps> = ({ title, dataKey, appData, onDataChange }) => {
    const [originalItems, setOriginalItems] = useState(() => deepClone(appData[dataKey]));
    const [draftItems, setDraftItems] = useState(() => deepClone(appData[dataKey]));
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    // Sync state if appData prop changes from parent
    useEffect(() => {
        setOriginalItems(deepClone(appData[dataKey]));
        setDraftItems(deepClone(appData[dataKey]));
    }, [appData, dataKey]);

    const hasChanges = useMemo(() => JSON.stringify(draftItems) !== JSON.stringify(originalItems), [draftItems, originalItems]);

    const handleReset = () => {
        setDraftItems(deepClone(originalItems));
    };

    const handleReorder = async (newOrder: any[]) => {
        setDraftItems(newOrder); // Optimistic update
        try {
            await reorderCollection(dataKey, newOrder);
            // Update the main app data state
            const newAppData = deepClone(appData);
            newAppData[dataKey] = newOrder.map((item, index) => ({ ...item, order: index }));
            setOriginalItems(newAppData[dataKey]); // Sync original state after successful reorder
            onDataChange(newAppData);
            addToast('Order saved successfully!', 'success');
        } catch (error) {
            console.error(error);
            setDraftItems(deepClone(appData[dataKey])); // Revert on error
            addToast('Error saving order.', 'error');
        }
    };

    const handleSaveItem = async (itemToSave: any) => {
        const isNew = !originalItems.find((i: any) => i.id === itemToSave.id);
        const optimisticItems = isNew
            ? [{ ...itemToSave, order: -1 }, ...draftItems].sort((a,b) => a.order - b.order)
            : draftItems.map((i: any) => (i.id === itemToSave.id ? itemToSave : i));
        
        setDraftItems(optimisticItems);
        setEditingItem(null);
        
        try {
            if (isNew) {
                const newOrderValue = Math.min(...originalItems.map((i:any) => i.order), 0) - 1;
                await addCollectionDoc(dataKey, {...itemToSave, order: newOrderValue});
            } else {
                await updateCollectionDoc(dataKey, itemToSave.id, itemToSave);
            }

            // Refetch or update global state to get the final correct order
            const newAppData = deepClone(appData);
            newAppData[dataKey] = isNew ? [itemToSave, ...newAppData[dataKey]] : newAppData[dataKey].map((i: any) => (i.id === itemToSave.id ? itemToSave : i));
            onDataChange(newAppData);
            setOriginalItems(newAppData[dataKey]);

            addToast(`${title} ${isNew ? 'created' : 'updated'} successfully!`, 'success');
        } catch (error) {
            console.error(error);
            handleReset(); // Revert changes on error
            addToast(`Error saving ${title}.`, 'error');
        }
    };

    const handleCreate = () => {
        if (originalItems.length === 0) {
            // A simple schema based on common fields
            setEditingItem({id: `${dataKey}_${Date.now()}`, name: `New ${title}`, title: `New ${title}`, description: ''});
            return;
        }
        const newItem = deepClone(originalItems[0]);
        Object.keys(newItem).forEach(key => {
            if (typeof newItem[key] === 'string' && key !== 'id') newItem[key] = '';
            if (typeof newItem[key] === 'boolean') newItem[key] = false;
            if (Array.isArray(newItem[key])) newItem[key] = [];
        });
        newItem.id = `${dataKey}_${Date.now()}`;
        if(newItem.name !== undefined) newItem.name = "New " + title;
        if(newItem.title !== undefined) newItem.title = "New " + title;
        setEditingItem(newItem);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${title}? This action is permanent.`)) {
            const newDraftItems = draftItems.filter((i: any) => i.id !== id);
            setDraftItems(newDraftItems); // Optimistic UI update

            try {
                await deleteCollectionDoc(dataKey, id);
                
                const newAppData = deepClone(appData);
                newAppData[dataKey] = newAppData[dataKey].filter((i: any) => i.id !== id);
                onDataChange(newAppData);
                setOriginalItems(newAppData[dataKey]);

                addToast(`${title} deleted successfully!`, 'success');
            } catch (error) {
                console.error(error);
                handleReset(); // Revert on error
                addToast(`Error deleting ${title}.`, 'error');
            }
        }
    };
    
    // This handles the general save button for changes made outside the modal (like reordering)
    const handleGeneralSave = async () => {
        setIsSaving(true);
        try {
            await handleReorder(draftItems); // Reorder function also saves the order
        } catch(error) {
            addToast(`Error saving changes.`, 'error');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div>
            <div className="mb-6 pb-4 border-b">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h2 className="text-2xl font-bold">{title}s</h2>
                    <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors shadow">
                        Add New {title}
                    </button>
                </div>
            </div>
            <Reorder.Group axis="y" values={draftItems} onReorder={setDraftItems}>
                <div className="space-y-2">
                    {draftItems.map((item: any) => (
                         <Reorder.Item key={item.id} value={item}>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border cursor-grab active:cursor-grabbing">
                                <p className="font-medium truncate pr-4">{item.name || item.title}</p>
                                <div className="space-x-2 flex-shrink-0">
                                    <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:underline text-sm font-semibold">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm font-semibold">Delete</button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </div>
            </Reorder.Group>
            {draftItems.length === 0 && <p className="text-gray-500 text-center py-8">No {title}s yet. Click "Add New" to create one.</p>}
            
            <ActionBar hasChanges={hasChanges} onSave={handleGeneralSave} onReset={handleReset} isSaving={isSaving} />

            <AnimatePresence>
                {editingItem && <EditModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CrudEditor;