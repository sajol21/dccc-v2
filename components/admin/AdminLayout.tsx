
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import type { User } from '../../services/firebaseService';

interface AdminLayoutProps {
    user: User | null;
    signOut: () => void;
    children: React.ReactNode;
}

const NavIcon: React.FC<{ name: string }> = ({ name }) => {
    const icons: Record<string, string> = {
        'Site Content': "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h9",
        Collections: "M4 6h16M4 10h16M4 14h16M4 18h16",
        Members: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2",
        Dashboard: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
        Theme: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
        Footer: "M5 15l7-7 7 7",
        Departments: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
        Events: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
        Achievements: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
        'Manage Panels': "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        'Add Member': "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zm6-4h-2V7h-2v2h-2v2h2v2h2v-2h2v-2z",
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
        </svg>
    )
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, signOut, children }) => {
    const navGroups = [
        { 
            name: 'Site Content', 
            tabs: [
                { name: 'Dashboard', path: 'dashboard' },
                { name: 'Theme', path: 'theme' },
                { name: 'Footer', path: 'footer' },
            ] 
        },
        {
            name: 'Collections',
            tabs: [
                { name: 'Departments', path: 'departments' },
                { name: 'Events', path: 'events' },
                { name: 'Achievements', path: 'achievements' },
            ]
        },
        {
            name: 'Members',
            tabs: [
                { name: 'Manage Panels', path: 'leaders' },
                { name: 'Add Member', path: 'leaders/add' },
            ]
        }
    ];

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();

    const { activeTabName, activeGroupName } = useMemo(() => {
        const currentPath = location.pathname.split('/admin/')[1]?.split('/')[0] || 'dashboard';
        for (const group of navGroups) {
            const activeTab = group.tabs.find(tab => tab.path.startsWith(currentPath));
            if (activeTab) {
                return { activeTabName: activeTab.name, activeGroupName: group.name };
            }
        }
        return { activeTabName: 'Dashboard', activeGroupName: 'Site Content' };
    }, [location.pathname, navGroups]);

    const [openGroup, setOpenGroup] = useState(activeGroupName);

    return (
        <div className="min-h-screen">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed top-0 left-0 h-full w-16 md:w-64 bg-gray-900 text-gray-300 flex flex-col z-40 shadow-lg">
                    <div className="flex items-center justify-center md:justify-start p-2 md:p-4 h-16 border-b border-gray-700/50 flex-shrink-0">
                       <img src="https://dhakacollegeculturalclub.com/logo.png" alt="DCCC Logo" className="h-10 w-auto bg-white rounded-full p-1" />
                        <span className="hidden md:inline text-lg font-bold ml-3 text-white">Admin Panel</span>
                    </div>
                    <nav className="flex-grow p-2 space-y-1 overflow-y-auto">
                        {navGroups.map(group => (
                            <div key={group.name}>
                                <button onClick={() => setOpenGroup(openGroup === group.name ? '' : group.name)} className="flex items-center justify-between w-full p-3 rounded-md hover:bg-gray-800 transition-colors text-left">
                                    <div className="flex items-center gap-3">
                                        <NavIcon name={group.name} />
                                        <span className="hidden md:inline font-semibold">{group.name}</span>
                                    </div>
                                    <motion.div 
                                        animate={{ rotate: openGroup === group.name ? 180 : 0}}
                                        className="hidden md:inline"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                {openGroup === group.name && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-1 pb-2 pl-4 md:pl-6 space-y-1">
                                            {group.tabs.map(tab => (
                                                <NavLink 
                                                    key={tab.name} 
                                                    to={tab.path}
                                                    end
                                                    className={({isActive}) => `flex items-center gap-3 w-full text-left p-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white shadow' : 'hover:bg-gray-800/50 hover:text-white'}`}
                                                >
                                                    <NavIcon name={tab.name} />
                                                    <span className="hidden md:inline">{tab.name}</span>
                                                </NavLink>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
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
                            <h1 className="text-xl font-bold text-gray-900">{activeTabName}</h1>
                             <div className="relative">
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.email}</span>
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
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
                    <main className="p-6 lg:p-10">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;