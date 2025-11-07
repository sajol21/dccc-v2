import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorTracker: React.FC = () => {
    const [isPointer, setIsPointer] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 28, stiffness: 400, mass: 0.1 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (e.target instanceof Element) {
                const target = e.target as HTMLElement;
                const isInteractive = 
                    target.closest('a, button, [role="button"]') ||
                    window.getComputedStyle(target).cursor === 'pointer';
                setIsPointer(!!isInteractive);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseOver);
        
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, [cursorX, cursorY]);
    
    const cursorVariants = {
        default: { scale: 1, rotate: 0, opacity: 0.8 },
        pointer: { scale: 1.5, rotate: 90, opacity: 1 }
    };
    
    const pathVariants = {
         default: {
            stroke: 'rgba(79, 70, 229, 0.8)',
            fill: 'rgba(79, 70, 229, 0.1)',
        },
        pointer: {
            stroke: 'rgba(239, 68, 68, 1)',
            fill: 'rgba(239, 68, 68, 0.2)',
        }
    }

    return (
        <motion.div
            variants={cursorVariants}
            animate={isPointer ? 'pointer' : 'default'}
            className="fixed top-0 left-0 pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[9999]"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
            transition={{ type: 'spring', ...springConfig }}
        >
            <motion.svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                transition={{ duration: 0.2 }}
            >
                <motion.path
                    d="M12 2L14.09 8.26L20.36 10.34L14.09 12.42L12 18.69L9.91 12.42L3.64 10.34L9.91 8.26L12 2Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={pathVariants}
                    initial="default"
                    animate={isPointer ? 'pointer' : 'default'}
                    transition={{ duration: 0.3 }}
                />
            </motion.svg>
        </motion.div>
    );
};

export default CursorTracker;