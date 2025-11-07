


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '../ToastProvider';
import Loader from '../Loader';

interface EditorWrapperProps<T> {
    title: string;
    description: string;
    fetcher: () => Promise<T>;
    saver: (data: T) => Promise<void>;
    children: (data: T, setData: (data: T) => void) => React.ReactNode;
}

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const EditorWrapper = <T,>({ title, description, fetcher, saver, children }: EditorWrapperProps<T>) => {
    const [originalData, setOriginalData] = useState<T | null>(null);
    const [draftData, setDraftData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    const loadData = useCallback(() => {
        setLoading(true);
        fetcher().then(d => {
            setOriginalData(deepClone(d));
            setDraftData(deepClone(d));
        }).catch((err) => {
            console.error(`Failed to fetch data for ${title}:`, err);
            addToast(`❌ Error loading ${title} data!`, 'error');
        }).finally(() => {
            setLoading(false);
        });
    }, [fetcher, title, addToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const hasChanges = useMemo(() => {
        if (!originalData || !draftData) return false;
        return JSON.stringify(originalData) !== JSON.stringify(draftData);
    }, [originalData, draftData]);

    const handleSave = useCallback(async () => {
        if (!draftData) return;
        setIsSaving(true);
        try {
            await saver(draftData);
            setOriginalData(deepClone(draftData));
            addToast('✅ Saved successfully!');
        } catch (error) {
            console.error(`Failed to save data for ${title}:`, error);
            addToast(`❌ Error saving ${title} data!`, 'error');
        } finally {
            setIsSaving(false);
        }
    }, [draftData, saver, title, addToast]);

    const handleReset = useCallback(() => {
        if (originalData) {
            setDraftData(deepClone(originalData));
            addToast('🔄 Changes have been reset.');
        }
    }, [originalData, addToast]);

    if (loading) {
        return <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>;
    }

    if (!draftData) {
        return <div className="text-center py-20 text-red-500">Error loading editor for {title}.</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <header className="p-6 border-b border-gray-200 bg-gray-50/50">
                 <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges || isSaving}
                            className="px-4 py-2 bg-white text-gray-800 rounded-md font-semibold border border-gray-300 hover:bg-gray-100 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors w-32"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="p-6">
                {children(draftData, setDraftData)}
            </main>
        </div>
    );
};

export default EditorWrapper;