

import React, { useRef, useEffect } from 'react';
import { useData } from '../hooks/useData';
import { getAppData } from '../services/firebaseService';

const culturalIcons = ['🎵', '🎭', '🎨', '📖'];

interface Ripple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    strength: number;
}

const InteractiveMesh: React.FC = () => {
    const { data: appData } = useData(getAppData);
    const theme = appData?.theme;
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ripplesRef = useRef<Ripple[]>([]);

    useEffect(() => {
        if (!theme) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        let animationFrameId: number;
        let particles: any[] = [];
        const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const handleMouseDown = (event: MouseEvent) => {
            if(!theme.clickEffectEnabled) return;
            ripplesRef.current.push({
                x: event.clientX,
                y: event.clientY,
                radius: 0,
                maxRadius: 100,
                strength: 0.5,
            });
        };
        if(theme.clickEffectEnabled) {
            window.addEventListener('mousedown', handleMouseDown);
        }

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            originalSize: number;
            speed: number;
            color: string;
            char: string | null;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, char: string | null = null) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.originalSize = size;
                this.size = size;
                this.speed = Math.random() * 0.4 + 0.1;
                this.color = theme.nodeColor;
                this.char = char;
            }

            draw() {
                if (this.char) {
                    ctx!.font = `${this.size * 2.5}px sans-serif`;
                    ctx!.fillStyle = this.color;
                    ctx!.globalAlpha = 0.8;
                    ctx!.fillText(this.char, this.x, this.y);
                    ctx!.globalAlpha = 1;
                } else {
                    ctx!.beginPath();
                    ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                    ctx!.fillStyle = this.color;
                    ctx!.fill();
                }
            }

            update() {
                this.size = this.originalSize;
                this.color = theme.nodeColor;

                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * theme.mouseRepelStrength;
                        this.y -= forceDirectionY * force * theme.mouseRepelStrength;

                        this.size = this.originalSize * 2;
                        this.color = theme.highlightColor;
                    }
                }

                ripplesRef.current.forEach(ripple => {
                    const dx = ripple.x - this.x;
                    const dy = ripple.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < ripple.radius && distance > ripple.radius - 20) {
                         const forceDirectionX = dx / distance;
                         const forceDirectionY = dy / distance;
                         this.x -= forceDirectionX * ripple.strength * 5;
                         this.y -= forceDirectionY * ripple.strength * 5;
                    }
                });

                this.x += this.directionX * this.speed;
                this.y += this.directionY * this.speed;

                this.draw();
            }
        }

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / theme.nodeDensity;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * theme.nodeSize + 1;
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const directionX = (Math.random() * 2) - 1;
                const directionY = (Math.random() * 2) - 1;
                
                let char: string | null = null;
                if (Math.random() < 0.02) {
                    char = culturalIcons[Math.floor(Math.random() * culturalIcons.length)];
                    size *= 2; // Make icons slightly bigger for visibility
                }

                particles.push(new Particle(x, y, directionX, directionY, size, char));
            }
        };

        const connect = () => {
            const connectDistance = (canvas.width / 7) * (canvas.height / 7);
            const highlightDistance = connectDistance / 4;

            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distanceSq = ((particles[a].x - particles[b].x) ** 2)
                                   + ((particles[a].y - particles[b].y) ** 2);
                    
                    if (distanceSq < connectDistance) {
                        const opacityValue = 1 - (distanceSq / 20000);
                        const isHighlighted = distanceSq < highlightDistance;

                        ctx!.strokeStyle = isHighlighted ? theme.lineHighlightColor : theme.lineColor;
                        ctx!.lineWidth = isHighlighted ? 1.5 : 1;
                        ctx!.globalAlpha = isHighlighted ? 1 : Math.max(0, opacityValue);

                        ctx!.beginPath();
                        ctx!.moveTo(particles[a].x, particles[a].y);
                        ctx!.lineTo(particles[b].x, particles[b].y);
                        ctx!.stroke();
                        ctx!.globalAlpha = 1;

                        // If highlighted, draw a cultural icon on the line
                        if (isHighlighted) {
                            const midX = (particles[a].x + particles[b].x) / 2;
                            const midY = (particles[a].y + particles[b].y) / 2;
                            const icon = culturalIcons[Math.floor(Math.random() * culturalIcons.length)];
                            ctx!.font = '16px sans-serif';
                            ctx!.fillStyle = theme.highlightColor;
                            ctx!.textAlign = 'center';
                            ctx!.textBaseline = 'middle';
                            ctx!.fillText(icon, midX, midY);
                        }
                    }
                }
            }
        };
        
        const updateRipples = () => {
            ripplesRef.current = ripplesRef.current.filter(ripple => {
                ripple.radius += 2;
                ripple.strength -= 0.01;
                return ripple.strength > 0;
            });
        };

        const animate = () => {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
            updateRipples();
            particles.forEach(p => p.update());
            connect();
            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if(theme.clickEffectEnabled) {
                window.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, [theme]);

    if (!theme) return null;

    return <canvas ref={canvasRef} style={{ background: theme.backgroundColor }} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default InteractiveMesh;
