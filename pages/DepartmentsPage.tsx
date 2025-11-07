import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDepartments } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import type { Department } from '../types';

const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <Link 
        to={`/departments/${department.id}`} 
        className="block relative rounded-2xl overflow-hidden group shadow-lg aspect-w-1 aspect-h-1"
    >
        <img 
            src={department.coverImage} 
            alt={department.name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" 
            loading="lazy" decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/90 group-hover:via-black/70 transition-all duration-300"></div>
        <div className="relative h-full flex flex-col justify-end p-6 text-white z-10">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-5xl mb-3 inline-block">{department.iconUrl}</span>
                <h3 className="text-3xl font-extrabold">{department.name}</h3>
                <p className="opacity-0 max-h-0 group-hover:max-h-40 group-hover:opacity-90 group-hover:mt-2 transition-all duration-300 ease-in-out text-sm">
                    {department.shortDesc}
                </p>
            </motion.div>
        </div>
    </Link>
);


const DepartmentsPage: React.FC = () => {
    const { data: departments, loading, error } = useData(getDepartments);

    return (
        <div>
            <header className="relative pt-16 pb-24 text-center bg-gray-900 text-white overflow-hidden">
                <img src="https://picsum.photos/1600/500?random=101" alt="Departments background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight"
                    >
                       Our Creative Universe
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
                    >
                        Explore the diverse departments that form the vibrant core of our club. Each is a unique world of passion and creativity waiting to be discovered.
                    </motion.p>
                </div>
            </header>
            
            <main className="py-20 bg-white">
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {loading && <div className="flex justify-center"><Loader /></div>}
                    {error && <p className="text-center text-red-500">Failed to load departments.</p>}

                    {departments && (
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
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
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <DepartmentCard department={dept} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DepartmentsPage;