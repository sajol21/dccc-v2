
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RichTextEditor from './RichTextEditor';
import ImageUploadInput from './ImageUploadInput';
import ArrayOfObjectsEditor from './ArrayOfObjectsEditor';

const getHumanLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const inputStyles = "block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition";

const FormInput: React.FC<any> = ({ label, value, onChange, type = 'text', ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className={inputStyles} 
            {...props} 
        />
    </div>
);

const TextAreaInput: React.FC<any> = ({ label, value, onChange, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea 
            value={value} 
            onChange={onChange} 
            className={inputStyles}
            {...props} 
        />
    </div>
);


const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button type="button" onClick={() => onChange(!checked)} className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0`}>
        <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
    </button>
);


interface EditModalProps {
    item: any;
    onSave: (item: any) => void;
    onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ item, onSave, onClose }) => {
    const [currentItem, setCurrentItem] = useState(item);

    const handleChange = (key: string, value: any) => {
        setCurrentItem((prev: any) => ({...prev, [key]: value}));
    };

    const renderField = (key: string, value: any) => {
        if (key === 'id') return null;
        const label = getHumanLabel(key);

        // Special handling for the 'type' field in Executive-like objects
        if (key === 'type' && ('dcccId' in currentItem || 'tenureYears' in currentItem)) {
            return (
                <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <select
                        value={value}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className={inputStyles}
                    >
                        <option value="">Select Type</option>
                        <option value="Presidency">Presidency</option>
                        <option value="Secretariat">Secretariat</option>
                        <option value="Executive">Executive</option>
                    </select>
                </div>
            );
        }
        
        if (key.toLowerCase().includes('imageurl') || key.toLowerCase().includes('coverimage') || key.toLowerCase().includes('logo')) {
            return <ImageUploadInput key={key} label={label} value={value} onChange={(val: string) => handleChange(key, val)} />;
        }
        if (key === 'date') {
            const dateValue = value ? new Date(value).toISOString().split('T')[0] : '';
            return <FormInput key={key} label={label} type="date" value={dateValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)} />;
        }
         if (key === 'time' || key.toLowerCase().includes('time24')) {
            return <FormInput key={key} label={label} type="time" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)} />;
        }
        if (typeof value === 'boolean') {
            return (
                <div key={key} className="flex items-center gap-4">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <ToggleSwitch checked={value} onChange={(val: boolean) => handleChange(key, val)} />
                </div>
            );
        }
        if (key.toLowerCase().includes('desc') || key.toLowerCase().includes('text') || key === 'bio') {
             return <RichTextEditor key={key} label={label} value={value} onChange={(val: string) => handleChange(key, val)} />;
        }
        if (Array.isArray(value)) {
             if (value.every(v => typeof v === 'string')) {
                return <TextAreaInput key={key} label={`${label} (one per line)`} rows={4} value={value.join('\n')} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(key, e.target.value.split('\n').filter(l => l))} />;
            }
            // Array of objects
            return <ArrayOfObjectsEditor key={key} label={label} value={value} onChange={(val: any[]) => handleChange(key, val)} />;
        }

        const isLongText = typeof value === 'string' && value.length > 80;
        return isLongText 
            ? <TextAreaInput key={key} label={label} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)} rows={4} />
            : <FormInput key={key} label={label} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)} />;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
             <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }} 
                onClick={e => e.stopPropagation()} 
                className="bg-white rounded-lg w-full max-w-2xl shadow-xl relative max-h-[90vh] flex flex-col"
            >
                 <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-bold">Edit {item.name || item.title}</h3>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                </header>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {Object.entries(currentItem).map(([key, value]) => renderField(key, value))}
                </div>
                <footer className="p-4 border-t flex justify-end gap-3 flex-shrink-0 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
                    <button onClick={() => onSave(currentItem)} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">Save</button>
                </footer>
            </motion.div>
        </motion.div>
    );
};

export default EditModal;