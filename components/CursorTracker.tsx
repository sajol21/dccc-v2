import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorTracker: React.FC = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 500 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (e.target instanceof Element) {
                const isInteractive = window.getComputedStyle(e.target).cursor === 'pointer';
                setIsPointer(isInteractive);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseover', handleMouseOver);
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);
    
    const variants = {
        default: {
            scale: 1,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.5)'
        },
        pointer: {
            scale: 1.5,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgba(59, 130, 246, 0.8)'
        }
    };

    return (
        <motion.div
            variants={variants}
            animate={isPointer ? 'pointer' : 'default'}
            className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[9999]"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        />
    );
};

export default CursorTracker;