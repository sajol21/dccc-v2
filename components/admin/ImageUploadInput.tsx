import React from 'react';

interface ImageUploadInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageUploadInput: React.FC<ImageUploadInputProps> = ({ label, value, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter image URL"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {value && (
                    <img
                        src={value}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded-md border bg-gray-100 flex-shrink-0"
                    />
                )}
            </div>
        </div>
    );
};

export default ImageUploadInput;
