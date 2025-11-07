
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { getEvents, getDepartments, getLeaders } from '../../services/firebaseService';
import Loader from '../Loader';

const StatCard: React.FC<{ title: string; value: number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <span className="text-2xl">{icon}</span>
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-500 font-medium">{title}</p>
        </div>
    </div>
);

const Shortcut: React.FC<{ title: string; link: string; icon: string }> = ({ title, link, icon }) => (
     <Link to={link} className="flex flex-col items-center justify-center gap-2 bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <span className="text-4xl">{icon}</span>
        <p className="font-semibold text-gray-700">{title}</p>
    </Link>
);


const AdminDashboard: React.FC = () => {
    const { data: eventsData, loading: loadingEvents } = useData(getEvents);
    const { data: departmentsData, loading: loadingDepts } = useData(getDepartments);
    const { data: leadersData, loading: loadingLeaders } = useData(getLeaders);

    const stats = useMemo(() => {
        const totalMembers = (leadersData?.moderators.length || 0) +
                             (leadersData?.currentExecutives.length || 0) +
                             (leadersData?.pastExecutives.length || 0);
        return {
            events: eventsData?.length || 0,
            departments: departmentsData?.length || 0,
            members: totalMembers
        };
    }, [eventsData, departmentsData, leadersData]);
    
    const isLoading = loadingEvents || loadingDepts || loadingLeaders;

    if (isLoading) {
        return <div className="min-h-[400px] flex items-center justify-center"><Loader /></div>;
    }

    return (
        <div>
             <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome! Here's a quick overview of your site.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Site Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Events" value={stats.events} icon="🎉" color="bg-red-100" />
                    <StatCard title="Departments" value={stats.departments} icon="🏛️" color="bg-blue-100" />
                    <StatCard title="Panel Members" value={stats.members} icon="👥" color="bg-green-100" />
                </div>
            </section>
            
            <section>
                 <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Shortcuts</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Shortcut title="Add Event" link="/admin/content/events" icon="➕" />
                    <Shortcut title="Add Member" link="/admin/team/add" icon="👤" />
                    <Shortcut title="Edit Home Page" link="/admin/content/home" icon="🏠" />
                    <Shortcut title="Manage Team" link="/admin/team/panels" icon="📋" />
                 </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
