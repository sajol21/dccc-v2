import React, { useRef, useEffect } from 'react';

// Emojis representing different cultural and technical departments
const particleEmojis = ['🎨', '🎵', '💻', '🎭', '✍️', '📈', '👥', '🎬'];

interface Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
    size: number;
    char: string;
    // For spring physics
    forceX: number;
    forceY: number;
}

interface InteractiveMeshProps {
  particleColor: string; // e.g., 'rgba(107, 114, 128, 0.8)'
  lineColorRGB: string;  // e.g., '107, 114, 128'
}

const InteractiveMesh: React.FC<InteractiveMeshProps> = ({ particleColor, lineColorRGB }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: Particle[] = [];
        const mouse = { x: -1000, y: -1000, radius: 150 };
        const springFactor = 0.02;
        const damping = 0.85;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        const init = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particles.length = 0;
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / 35000);

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 12 + 12;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particles.push({
                    x, y,
                    originX: x, originY: y,
                    vx: 0, vy: 0,
                    size,
                    char: particleEmojis[Math.floor(Math.random() * particleEmojis.length)],
                    forceX: 0, forceY: 0,
                });
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connect();

            particles.forEach(p => {
                // Mouse repulsion force
                const dxMouse = p.x - mouse.x;
                const dyMouse = p.y - mouse.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                let repelForce = 0;
                if (distMouse < mouse.radius) {
                    repelForce = (mouse.radius - distMouse) / mouse.radius;
                }

                // Spring force to return to origin
                p.forceX = (p.originX - p.x) * springFactor;
                p.forceY = (p.originY - p.y) * springFactor;
                
                if (repelForce > 0) {
                    p.forceX += (dxMouse / distMouse) * repelForce * 1.5;
                    p.forceY += (dyMouse / distMouse) * repelForce * 1.5;
                }

                p.vx = (p.vx + p.forceX) * damping;
                p.vy = (p.vy + p.forceY) * damping;

                p.x += p.vx;
                p.y += p.vy;

                // Draw particle
                ctx.font = `${p.size}px sans-serif`;
                ctx.fillStyle = particleColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.char, p.x, p.y);
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        
        const connect = () => {
            if (!ctx) return;
            const connectDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectDistance) {
                        ctx.strokeStyle = `rgba(${lineColorRGB}, ${1 - distance / connectDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };


        init();
        animate();

        window.addEventListener('resize', init);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', init);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [particleColor, lineColorRGB]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
        />
    );
};

export default InteractiveMesh;