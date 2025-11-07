import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    // This effect ensures that if the value is changed externally (e.g., by resetting the form),
    // the content of the contentEditable div is updated.
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCmd = (cmd: string) => {
        // This is a deprecated but simple way to implement a rich text editor.
        // For more complex needs, a library like Slate.js or TipTap would be better.
        document.execCommand(cmd, false);
        editorRef.current?.focus();
        handleInput(); // Ensure change is registered after command
    };
    
    return (
        <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="border border-gray-300 rounded-md shadow-sm">
                <div className="flex items-center gap-1 p-1 border-b bg-gray-50 rounded-t-md">
                    <button type="button" title="Bold" onClick={() => execCmd('bold')} className="font-bold w-8 h-8 hover:bg-gray-200 rounded">B</button>
                    <button type="button" title="Italic" onClick={() => execCmd('italic')} className="italic w-8 h-8 hover:bg-gray-200 rounded">I</button>
                    <button type="button" title="Underline" onClick={() => execCmd('underline')} className="underline w-8 h-8 hover:bg-gray-200 rounded">U</button>
                    <button type="button" title="Unordered List" onClick={() => execCmd('insertUnorderedList')} className="w-8 h-8 hover:bg-gray-200 rounded">
                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    </button>
                     <button type="button" title="Ordered List" onClick={() => execCmd('insertOrderedList')} className="w-8 h-8 hover:bg-gray-200 rounded">
                        <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
                    </button>
                </div>
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="prose max-w-none p-3 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-b-md"
                    dangerouslySetInnerHTML={{ __html: value || '' }}
                />
            </div>
        </div>
    );
};

export default RichTextEditor;
