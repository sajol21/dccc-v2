
import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import EditModal from './EditModal';

interface CrudEditorProps<T extends {id: string, name?: string, title?: string}> {
    title: string;
    items: T[];
    setItems: (items: T[]) => void;
}

const CrudEditor = <T extends {id: string, name?: string, title?: string}>({ title, items, setItems }: CrudEditorProps<T>) => {
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

    const handleCreate = () => {
        // Create a new item by deeply cloning the first item in the list,
        // or create a default object if the list is empty.
        let newItem: any;
        if (items.length > 0) {
            newItem = JSON.parse(JSON.stringify(items[0]));
             Object.keys(newItem).forEach(key => {
                if (typeof newItem[key] === 'string') newItem[key] = '';
                if (typeof newItem[key] === 'boolean') newItem[key] = false;
                if (Array.isArray(newItem[key])) newItem[key] = [];
                if (typeof newItem[key] === 'number') newItem[key] = 0;
                if (key.toLowerCase().includes('imageurl')) newItem[key] = '';
            });
        } else {
            // A sensible default if the list is empty
            newItem = { name: `New ${title}`, description: '' };
        }
       
        newItem.id = `${title.toLowerCase().replace(' ', '-')}_${Date.now()}`;
        if (newItem.name !== undefined) newItem.name = "New " + title;
        if (newItem.title !== undefined) newItem.title = "New " + title;
        setEditingItem(newItem);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(`Are you sure you want to delete this ${title}?`)) {
            setItems(items.filter(i => i.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{title}s</h3>
                <button onClick={handleCreate} className="px-4 py-2 bg-green-600 text-white text-sm rounded-md font-semibold hover:bg-green-700 transition-colors shadow">
                    Add New
                </button>
            </div>

            <Reorder.Group axis="y" values={items} onReorder={setItems}>
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
