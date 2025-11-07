import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CursorTracker: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[9999]"
            style={{
                background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0) 70%)',
            }}
            animate={{
                x: mousePosition.x,
                y: mousePosition.y,
            }}
            transition={{
                type: 'tween',
                ease: 'backOut',
                duration: 0.5,
            }}
        />
    );
};

export default CursorTracker;
