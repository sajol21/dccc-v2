import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDepartmentById, getLeaderById } from '../services/firebaseService';
import Loader from '../components/Loader';
import type { Department, Executive, Moderator } from '../types';

type Person = Moderator | Executive;

const ActivityIcon: React.FC = () => (
    <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-100 rounded-full border-4 border-white flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    </div>
);

const DepartmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [department, setDepartment] = useState<Department | null>(null);
    const [coordinator, setCoordinator] = useState<Person | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getDepartmentById(id);
                if (data) {
                    setDepartment(data);
                    if(data.coordinatorId) {
                        const leaderData = await getLeaderById(data.coordinatorId);
                        if(leaderData) setCoordinator(leaderData);
                    }
                } else {
                    setError('Department not found.');
                }
            } catch (err) {
                setError('Failed to fetch department data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDepartment();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center pt-20 bg-white"><Loader /></div>;
    if (error || !department) return <div className="text-center py-40 text-red-500">{error || 'Department not found.'}</div>;

    return (
        <div className="pt-20 bg-white min-h-screen">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[40vh] min-h-[250px] max-h-[400px] bg-gray-900"
            >
                <img src={department.coverImage} alt={department.name} className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white container mx-auto">
                    <span className="text-7xl mb-4 inline-block">{department.iconUrl}</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{department.name}</h1>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                 <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">About {department.name}</h2>
                        <p>{department.fullDesc}</p>
                    </motion.div>

                    {department.keyActivities && department.keyActivities.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                             className="mb-16"
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">Key Activities</h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {department.keyActivities.map((activity, index) => (
                                    <div key={index} className="relative bg-gray-50 p-6 pl-10 rounded-lg border border-gray-200">
                                        <ActivityIcon />
                                        <p className="text-gray-800 font-semibold">{activity}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                     )}
                    
                    {coordinator && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                        >
                            <h3 className="text-3xl font-bold text-gray-900 mb-8">Meet the Coordinator</h3>
                             <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                                <img src={coordinator.imageUrl} alt={coordinator.name} className="w-28 h-28 rounded-full object-contain bg-white border-4 border-blue-200 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-2xl text-gray-800">{coordinator.name}</h4>
                                    <p className="text-md text-blue-600 font-semibold mb-2">{coordinator.position}</p>
                                    <p className="text-sm text-gray-600 mb-4">{coordinator.bio.substring(0,100)}...</p>
                                    <Link to="/leaders" className="font-semibold text-sm text-gray-500 hover:text-blue-600 transition-colors group">
                                        View full leadership panel <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default DepartmentDetailPage;