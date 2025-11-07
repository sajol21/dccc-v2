
import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import EditModal from './EditModal';

// FIX: Add optional title and template props to support adding new items.
interface CrudEditorProps<T extends {id: string, name?: string, title?: string}> {
    items: T[];
    setItems: (items: T[]) => void;
    title?: string;
    template?: T;
}

const CrudEditor = <T extends {id: string, name?: string, title?: string}>({ items, setItems, title, template }: CrudEditorProps<T>) => {
    const [editingItem, setEditingItem] = useState<T | null>(null);

    const handleAddItem = () => {
        if (template) {
            setEditingItem({ ...template });
        }
    };

    const handleSaveItem = (itemToSave: T) => {
        // FIX: Improved logic to differentiate between adding a new item and updating an existing one.
        const existingItem = items.find(i => i.id === itemToSave.id && i.id !== '');

        if (existingItem) {
            // Update
            setItems(items.map(i => (i.id === itemToSave.id ? itemToSave : i)));
        } else {
            // Add new, and generate a unique ID
            const finalItem = { ...itemToSave };
            const slugPart = (finalItem.name || finalItem.title || 'item')
                .toLowerCase()
                .replace(/[^a-z0-9\s]/gi, '')
                .trim()
                .replace(/\s+/g, '-');
            finalItem.id = `${slugPart}-${Date.now()}`;
            setItems([finalItem, ...items]);
        }
        setEditingItem(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this item?`)) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div>
            {/* FIX: Add a button to create new items if template and title are provided. */}
            {title && template && (
                <div className="text-right mb-4">
                    <button 
                        onClick={handleAddItem} 
                        className="px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors"
                    >
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
                    {/* FIX: Dynamically change empty state message based on props. */}
                    No items yet. {title && template ? `Click 'Add New ${title}' to create one.` : "Add one from the 'Members > Add Member' tab."}
                </p>
            )}

            <AnimatePresence>
                {editingItem && <EditModal item={editingItem} onSave={handleSaveItem} onClose={() => setEditingItem(null)} />}
            </AnimatePresence>
        </div>
    );
};

export default CrudEditor;