import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDepartments } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Department } from '../types';

const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <Link to={`/departments/${department.id}`} className="block aspect-[4/5] relative rounded-xl overflow-hidden group shadow-lg">
        <img src={department.coverImage} alt={department.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors"></div>
        <div className="relative h-full flex flex-col justify-between p-6 text-white z-10">
            <div className="text-5xl self-start">{department.iconUrl}</div>
            <div>
                <h3 className="text-2xl font-bold mb-1">{department.name}</h3>
                <p className="text-sm opacity-90">{department.shortDesc}</p>
            </div>
        </div>
    </Link>
);


const DepartmentsPage: React.FC = () => {
    const { data: departments, loading, error } = useData(getDepartments);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                           Our Departments
                        </span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                        The creative pillars of our club, each with a unique identity and purpose.
                    </p>
                </motion.div>
                
                {loading && <div className="flex justify-center"><Loader /></div>}
                {error && <p className="text-center text-red-500">Failed to load departments.</p>}

                {departments && (
                    <motion.div 
                        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {departments.map((dept) => (
                            <motion.div
                                key={dept.id}
                                variants={{
                                    hidden: { opacity: 0, y: 50 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <DepartmentCard department={dept} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DepartmentsPage;