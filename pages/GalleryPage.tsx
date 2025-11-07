import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGalleryData } from '../services/firebaseService';
import { useData } from '../hooks/useData';
import Loader from '../components/Loader';
import Section from '../components/Section';
import type { GalleryItem } from '../types';

const GalleryPage: React.FC = () => {
    const { data: galleryItems, loading, error } = useData(getGalleryData);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const categories = useMemo(() => {
        if (!galleryItems) return [];
        return ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))];
    }, [galleryItems]);

    const filteredItems = useMemo(() => {
        if (!galleryItems) return [];
        if (selectedCategory === 'All') return galleryItems;
        return galleryItems.filter(item => item.category === selectedCategory);
    }, [galleryItems, selectedCategory]);

    return (
        <div className="pt-20 min-h-screen bg-white">
            <Section title="Our Gallery" subtitle="A visual journey through our club's most memorable moments.">
                 <div className="flex justify-center flex-wrap gap-2 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                selectedCategory === category 
                                ? 'bg-blue-600 text-white shadow' 
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading && <Loader />}
                {error && <p className="text-center text-red-500">Failed to load gallery.</p>}

                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                     <AnimatePresence>
                        {filteredItems && filteredItems.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                                onClick={() => setLightboxImage(item.imageUrl)}
                            >
                                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                    <p className="text-white text-xs font-semibold">{item.title}</p>
                                </div>
                            </motion.div>
                        ))}
                     </AnimatePresence>
                </motion.div>
            </Section>

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
                            src={lightboxImage}
                            alt="Lightbox"
                            className="max-w-full max-h-full rounded-lg shadow-2xl"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        />
                         <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white text-3xl">&times;</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryPage;
