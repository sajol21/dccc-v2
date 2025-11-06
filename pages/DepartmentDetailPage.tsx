
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDepartmentById } from '../services/firebaseService';
import Loader from '../components/Loader';
import type { Department } from '../types';

const DepartmentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [department, setDepartment] = useState<Department | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getDepartmentById(id);
                if (data) {
                    setDepartment(data);
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

    if (loading) return <div className="h-screen flex items-center justify-center pt-20"><Loader /></div>;
    if (error || !department) return <div className="text-center py-40 text-red-500">{error || 'Department not found.'}</div>;

    return (
        <div className="pt-28 pb-20 min-h-screen bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <div className="text-7xl mb-4">{department.iconUrl}</div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                        {department.name} Department
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed mb-16"
                >
                    <p>{department.fullDesc}</p>
                </motion.div>

                {department.gallery && department.gallery.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {department.gallery.map((item, index) => (
                                <motion.div
                                    key={index}
                                    layoutId={`gallery-item-${index}`}
                                    onClick={() => setLightboxImage(item.url)}
                                    className="cursor-pointer aspect-w-1 aspect-h-1 bg-gray-800 rounded-lg overflow-hidden group"
                                >
                                    <img src={item.thumbUrl} alt={`Gallery item ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setLightboxImage(null)}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    >
                        <motion.img
                            layoutId={lightboxImage}
                            src={lightboxImage}
                            alt="Lightbox"
                            className="max-w-full max-h-full rounded-lg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DepartmentDetailPage;
