
import React from 'react';
// FIX: Corrected import path for User type.
import type { User } from '../../services/firebaseService';

interface AdminLayoutProps {
    user: User | null;
    signOut: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    hasChanges: boolean;
    isSaving: boolean;
    onSave: () => void;
    onReset: () => void;
    children: React.ReactNode;
}

const NavIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: Record<string, string> = {
        Dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        Theme: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
        Footer: "M5 15l7-7 7 7",
        Departments: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
        Events: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        Achievements: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
        Leaders: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
        </svg>
    )
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, signOut, activeTab, setActiveTab, hasChanges, isSaving, onSave, onReset, children }) => {
    const tabs = ['Dashboard', 'Theme', 'Footer', 'Departments', 'Events', 'Achievements', 'Leaders'];

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed top-0 left-0 h-full w-16 md:w-64 bg-gray-800 text-white flex flex-col z-40 pt-20">
                    <nav className="flex-grow p-2 space-y-2">
                        {tabs.map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)} 
                                className={`flex items-center gap-3 w-full text-left p-3 rounded-md font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-700'}`}
                            >
                                <NavIcon name={tab} />
                                <span className="hidden md:inline">{tab}</span>
                            </button>
                        ))}
                    </nav>
                     <div className="p-2 border-t border-gray-700">
                         <button onClick={signOut} className="flex items-center gap-3 w-full text-left p-3 rounded-md font-medium transition-colors hover:bg-gray-700">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 ml-16 md:ml-64">
                    <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-30">
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 container mx-auto px-4 sm:px-6 lg:px-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{activeTab} Settings</h1>
                                <p className="text-sm text-gray-500">Logged in as {user?.email}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={onReset}
                                    disabled={!hasChanges || isSaving}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={!hasChanges || isSaving}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors w-32"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </header>
                    <main className="p-4 sm:p-6 lg:p-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;