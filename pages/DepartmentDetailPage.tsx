import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDepartmentById, getCurrentExecutives } from '../services/firebaseService';
import Loader from '../components/Loader';
import Section from '../components/Section';
import type { Department, Executive } from '../types';

const LeaderCard: React.FC<{ person: Executive }> = ({ person }) => (
    <div className="relative aspect-[0.85] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
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
    const [executives, setExecutives] = useState<Executive[]>([]);
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
                    const allExecutives = await getCurrentExecutives();
                    const departmentExecutives = allExecutives.filter(exec => exec.department === id);
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

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader /></div>;
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
        <div className="bg-white min-h-screen font-sans">
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">About {department.name}</h2>
                        <div className="prose lg:prose-lg text-gray-700 leading-relaxed">
                            <p>{department.fullDesc}</p>
                        </div>
                    </motion.div>
                    <motion.aside variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-28 border border-gray-200/80">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Activities</h3>
                            <ul className="space-y-2">
                                {department.keyActivities.map((activity, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-indigo-500 mr-2 mt-1">&#10003;</span>
                                        <span className="text-gray-700">{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.aside>
                </div>
            </motion.div>
            
            {(executives && executives.length > 0) && (
                <Section title="The Leaders" alternateBackground>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
                        {executives.map(exec => {
                             const displayExec = {
                                ...exec,
                                position: exec.position.replace(`${department.name} - `, '')
                            };
                           return <LeaderCard key={exec.id} person={displayExec} />;
                        })}
                    </div>
                     <div className="text-center mt-12">
                        <Link to="/panel" className="px-6 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-300">
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