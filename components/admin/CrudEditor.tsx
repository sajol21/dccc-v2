


import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import EditModal from './EditModal';

interface CrudEditorProps<T extends {id: string, name?: string, title?: string}> {
    title: string;
    items: T[];
    setItems: (items: T[]) => void;
    template?: T;
}

const CrudEditor = <T extends {id: string, name?: string, title?: string}>({ title, items, setItems, template }: CrudEditorProps<T>) => {
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const handleSaveItem = (itemToSave: T) => {
        const isNew = !items.find(i => i.id === itemToSave.id);
        if (isNew) {
            setItems([itemToSave, ...items]);
        } else {
            setItems(items.map(i => i.id === itemToSave.id ? itemToSave : i));
        }
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${title}?`)) {
            setItems(items.filter(i => i.id !== id));
        }
    };
    
    const handleAddNew = () => {
        if (template) {
            const newItem: any = {
                ...template,
                id: `new_${Date.now()}`,
            };
            if ('name' in newItem) newItem.name = `New ${title}`;
            if ('title' in newItem) newItem.title = `New ${title}`;
            
            setEditingItem(newItem as T);
        }
    };

    return (
        <div>
            {template && (
                <div className="mb-4 text-right">
                    <button onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors">
                        Add New {title}
                    </button>
                </div>
            )}
            <Reorder.Group axis="y" values={items} onReorder={setItems}>
                <div className="space-y-2">
                    {items.map(item => (
                        <Reorder.Item key={item.id} value={item}>
                            <div className="flex items-center justify-between p-3 bg-white rounded-md border border-gray-200 cursor-grab active:cursor-grabbing shadow-sm">
                                <p className="font-medium text-gray-800">{item.name || item.title}</p>
                                <div className="space-x-3 flex-shrink-0">
                                    <button onClick={() => setEditingItem(item)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors">Delete</button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </div>
            </Reorder.Group>
            {items.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                    {template 
                        ? `No ${title}s yet. Click 'Add New ${title}' to create one.`
                        : `No ${title}s yet. Add one from the 'Add Member' tab.`
                    }
                </p>
            )}

            <AnimatePresence>
                {editingItem && <EditModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CrudEditor;