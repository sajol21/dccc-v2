import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDepartmentById, getLeaders } from '../services/firebaseService';
import Loader from '../components/Loader';
import Section from '../components/Section';
import type { Department, Person, Executive } from '../types';

const CoordinatorCard: React.FC<{ person: Person }> = ({ person }) => (
    <div className="relative w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 group">
        <div className="aspect-[0.85] p-4 flex items-center justify-center">
             <img src={person.imageUrl} alt={person.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white w-full text-center">
            <h3 className="font-bold text-lg leading-tight">{person.name}</h3>
            <p className="text-sm opacity-90 uppercase">{person.position}</p>
        </div>
    </div>
);


const ExecutiveCard: React.FC<{ person: Executive }> = ({ person }) => (
    <div className="relative aspect-[0.85] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 flex items-center justify-center p-4">
            <img src={person.imageUrl} alt={person.name} className="w-full h-full object-contain" loading="lazy" decoding="async" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-3 text-white w-full text-center">
            <h3 className="font-bold text-sm leading-tight">{person.name}</h3>
            <p className="text-xs opacity-90 uppercase">{person.position}</p>
        </div>
    </div>
);

const DepartmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [department, setDepartment] = useState<Department | null>(null);
    const [coordinator, setCoordinator] = useState<Person | null>(null);
    const [executives, setExecutives] = useState<Executive[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [deptData, leadersData] = await Promise.all([
                    getDepartmentById(id),
                    getLeaders()
                ]);

                if (deptData) {
                    setDepartment(deptData);
                    const allLeaders: Person[] = [...leadersData.moderators, ...leadersData.currentExecutives, ...leadersData.pastExecutives];

                    if (deptData.coordinatorId) {
                        const foundCoordinator = allLeaders.find(leader => leader.id === deptData.coordinatorId);
                        setCoordinator(foundCoordinator || null);
                    }

                    const departmentExecutives = leadersData.currentExecutives.filter(exec => 
                        exec.department === id && exec.id !== deptData.coordinatorId
                    );
                    setExecutives(departmentExecutives);

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
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900"><Loader /></div>;
    if (error || !department) return <div className="text-center py-40 text-red-500">{error || 'Department not found.'}</div>;

     const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <header className="relative h-[50vh] min-h-[350px] flex items-center justify-center text-white text-center overflow-hidden">
                <img src={department.coverImage} alt={department.name} className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 bg-black/60 z-10"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-20"
                >
                    <div className="text-6xl mb-4">{department.iconUrl}</div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">{department.name}</h1>
                </motion.div>
            </header>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">About {department.name}</h2>
                        <div className="prose lg:prose-lg dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed max-w-none">
                            <p>{department.fullDesc}</p>
                        </div>
                    </motion.div>
                    <motion.aside variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-28 border border-gray-200/80 dark:border-gray-700">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Activities</h3>
                            <ul className="space-y-2">
                                {department.keyActivities.map((activity, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-indigo-500 mr-2 mt-1">&#10003;</span>
                                        <span className="text-gray-700 dark:text-gray-400">{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.aside>
                </div>
            </motion.div>
            
            {coordinator && (
                 <Section title="Department Coordinator">
                    <CoordinatorCard person={coordinator} />
                </Section>
            )}

            {(executives && executives.length > 0) && (
                <Section title={`Executive Panel - ${department.name}`} alternateBackground>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
                        {executives.map(exec => {
                             const displayExec = {
                                ...exec,
                                position: exec.position.replace(`${department.name} - `, '')
                            };
                           return <ExecutiveCard key={exec.id} person={displayExec} />;
                        })}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/team" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-300">
                            See All Leaders
                        </Link>
                    </div>
                </Section>
            )}

            <div className="text-center py-16">
                 <Link to="/departments" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                    &larr; Back to All Departments
                </Link>
            </div>
        </div>
    );
};

export default DepartmentDetailPage;