
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDepartments } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Department } from '../types';

const DepartmentCard: React.FC<{ department: Department, index: number }> = ({ department, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center border border-gray-700 hover:border-teal-400 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/20 transform hover:-translate-y-2"
    >
        <div className="text-6xl mb-6">{department.iconUrl}</div>
        <h3 className="text-2xl font-bold mb-3">{department.name}</h3>
        <p className="text-gray-400 mb-6 h-20">{department.shortDesc}</p>
        <Link to={`/departments/${department.id}`} className="mt-auto px-6 py-2 rounded-md font-semibold text-white bg-teal-500 hover:bg-teal-600 transition-colors duration-300">
            Explore
        </Link>
    </motion.div>
);

const DepartmentsPage: React.FC = () => {
    const { data: departments, loading, error } = useData(getDepartments);

    return (
        <div className="pt-28 pb-20 min-h-screen bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        Our Departments
                    </h1>
                    <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
                        The creative pillars of our club, each with a unique identity and purpose.
                    </p>
                </motion.div>
                
                {loading && <Loader />}
                {error && <p className="text-center text-red-500">Failed to load departments.</p>}

                {departments && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {departments.map((dept, i) => (
                            <DepartmentCard key={dept.id} department={dept} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentsPage;
