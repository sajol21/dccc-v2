import React from 'react';

const getHumanLabel = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

const FormInput: React.FC<any> = ({ label, value, onChange, type = 'text', ...props }) => (
    <div className="flex-1 min-w-[100px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            {...props} 
        />
    </div>
);

interface ArrayOfObjectsEditorProps {
    label: string;
    value: any[];
    onChange: (value: any[]) => void;
}

const ArrayOfObjectsEditor: React.FC<ArrayOfObjectsEditorProps> = ({ label, value = [], onChange }) => {
    
    const handleItemChange = (index: number, key: string, newValue: any) => {
        const newArray = [...value];
        newArray[index] = { ...newArray[index], [key]: newValue };
        onChange(newArray);
    };

    const handleAddItem = () => {
        const newItem = value.length > 0 ? { ...value[0] } : {};
        // Clear values of the new item
        Object.keys(newItem).forEach(key => {
            newItem[key] = '';
        });
        onChange([...value, newItem]);
    };

    const handleRemoveItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    if (!value || value.length === 0) {
        return (
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <button type="button" onClick={handleAddItem} className="mt-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                    Add Item
                </button>
            </div>
        )
    }

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="space-y-3">
                {value.map((item, index) => (
                    <div key={index} className="flex items-end gap-2 p-3 border rounded bg-gray-50/80">
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {Object.entries(item).map(([key, fieldValue]) => (
                                <FormInput 
                                    key={key} 
                                    label={getHumanLabel(key)} 
                                    value={fieldValue} 
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleItemChange(index, key, e.target.value)}
                                />
                            ))}
                        </div>
                        <button 
                            type="button" 
                            onClick={() => handleRemoveItem(index)} 
                            className="flex-shrink-0 px-3 py-2 bg-red-500 text-white rounded-md h-9 hover:bg-red-600"
                            aria-label="Remove item"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddItem} className="mt-3 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                Add Item
            </button>
        </div>
    );
};

export default ArrayOfObjectsEditor;
