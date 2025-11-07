


import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User } from '../../services/firebaseService';

interface AdminLayoutProps {
    user: User | null;
    signOut: () => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    children: React.ReactNode;
}

const NavIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: Record<string, string> = {
        Dashboard: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
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

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, signOut, activeTab, setActiveTab, children }) => {
    const tabs = ['Dashboard', 'Theme', 'Footer', 'Departments', 'Events', 'Achievements', 'Leaders'];
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="min-h-screen">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed top-0 left-0 h-full w-16 md:w-64 bg-gray-900 text-gray-300 flex flex-col z-40 shadow-lg">
                    <div className="flex items-center justify-center md:justify-start p-2 md:p-4 h-16 border-b border-gray-700/50 flex-shrink-0">
                       <img src="https://dhakacollegeculturalclub.com/logo.png" alt="DCCC Logo" className="h-10 w-auto bg-white rounded-full p-1" />
                        <span className="hidden md:inline text-lg font-bold ml-3 text-white">Admin Panel</span>
                    </div>
                    <nav className="flex-grow p-2 space-y-2 overflow-y-auto">
                        {tabs.map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)} 
                                className={`flex items-center gap-3 w-full text-left p-3 rounded-md font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'hover:bg-gray-800 hover:text-white'}`}
                            >
                                <NavIcon name={tab} />
                                <span className="hidden md:inline">{tab}</span>
                            </button>
                        ))}
                    </nav>
                     <div className="p-2 border-t border-gray-700/50 flex-shrink-0">
                        <a 
                            href="#/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 w-full text-left p-3 rounded-md font-medium transition-colors hover:bg-gray-800 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="hidden md:inline">View Site</span>
                        </a>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 ml-16 md:ml-64">
                    {/* Top Header */}
                    <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-30 shadow-sm">
                        <div className="h-16 flex items-center justify-between px-6 lg:px-8">
                            <h1 className="text-xl font-bold text-gray-900">{activeTab}</h1>
                             <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.email}</span>
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5"
                                    >
                                        <div className="px-4 py-2 text-xs text-gray-500 border-b">{user?.email}</div>
                                        <button 
                                            onClick={signOut} 
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </header>
                    <main className="p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;