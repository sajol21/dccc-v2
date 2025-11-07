
import React, { useRef, useEffect, useCallback } from 'react';

// Admin-editable props would be passed here
interface InteractiveMeshProps {
    backgroundColor?: string;
    nodeColor?: string;
    highlightColor?: string;
    lineColor?: string;
    lineHighlightColor?: string;
    nodeDensity?: number;
    nodeSize?: number;
    toneVolume?: number;
    mouseRepelStrength?: number;
    clickEffectEnabled?: boolean;
}

interface Ripple {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    strength: number;
}

const InteractiveMesh: React.FC<InteractiveMeshProps> = ({
    backgroundColor = '#f9fafb', // gray-50
    nodeColor = 'rgba(37, 99, 235, 0.7)', // blue-600 with opacity
    highlightColor = 'rgba(96, 165, 250, 1)', // solid blue-400
    lineColor = 'rgba(37, 99, 235, 0.3)', // blue-600 with opacity
    lineHighlightColor = 'rgba(59, 130, 246, 0.8)', // blue-500 with opacity
    nodeDensity = 10000, // increased density
    nodeSize = 2.5, // slightly larger nodes
    toneVolume = 0.05,
    mouseRepelStrength = 3,
    clickEffectEnabled = true,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const ripplesRef = useRef<Ripple[]>([]);

    const playTone = useCallback((x: number, y: number) => {
        if (!audioContextRef.current) return;
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        const freq = 200 + (x / window.innerWidth) * 300 + (y / window.innerHeight) * 100;
        oscillator.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(toneVolume, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContextRef.current.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        oscillator.start(audioContextRef.current.currentTime);
        oscillator.stop(audioContextRef.current.currentTime + 0.5);
    }, [toneVolume]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const initAudio = () => {
             if (!audioContextRef.current) {
                try {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                } catch (e) {
                    console.error("Web Audio API is not supported in this browser.");
                }
            }
        };
        window.addEventListener('mousedown', initAudio, { once: true });
        window.addEventListener('touchstart', initAudio, { once: true });


        let animationFrameId: number;
        let particles: any[] = [];
        const mouse = { x: null as number | null, y: null as number | null, radius: 150 };

        const handleMouseMove = (event: MouseEvent) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        const handleMouseDown = (event: MouseEvent) => {
            if(!clickEffectEnabled) return;
            ripplesRef.current.push({
                x: event.clientX,
                y: event.clientY,
                radius: 0,
                maxRadius: 100,
                strength: 0.5,
            });
        };
        if(clickEffectEnabled) {
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

            constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.originalSize = size;
                this.size = size;
                this.speed = Math.random() * 0.4 + 0.1;
                this.color = nodeColor;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx!.fillStyle = this.color;
                ctx!.fill();
            }

            update() {
                // Reset state from previous frame
                this.size = this.originalSize;
                this.color = nodeColor;

                // Wall collision
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * mouseRepelStrength;
                        this.y -= forceDirectionY * force * mouseRepelStrength;

                        // Visual feedback for mouse interaction
                        this.size = this.originalSize * 2;
                        this.color = highlightColor;

                        if(Math.random() < 0.01) {
                            playTone(this.x, this.y);
                        }
                    }
                }

                // Ripple interaction
                ripplesRef.current.forEach(ripple => {
                    const dx = ripple.x - this.x;
                    const dy = ripple.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    // Check if particle is on the expanding edge of the ripple
                    if (distance < ripple.radius && distance > ripple.radius - 20) {
                         const forceDirectionX = dx / distance;
                         const forceDirectionY = dy / distance;
                         this.x -= forceDirectionX * ripple.strength * 5;
                         this.y -= forceDirectionY * ripple.strength * 5;
                    }
                });

                // Move particle
                this.x += this.directionX * this.speed;
                this.y += this.directionY * this.speed;

                this.draw();
            }
        }

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / nodeDensity;
            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * nodeSize + 1;
                const x = Math.random() * (canvas.width - size * 2) + size;
                const y = Math.random() * (canvas.height - size * 2) + size;
                const directionX = (Math.random() * 2) - 1;
                const directionY = (Math.random() * 2) - 1;
                particles.push(new Particle(x, y, directionX, directionY, size));
            }
        };

        const connect = () => {
            const connectDistance = (canvas.width / 7) * (canvas.height / 7);
            const highlightDistance = connectDistance / 4; // Highlight if closer

            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distanceSq = ((particles[a].x - particles[b].x) ** 2)
                                   + ((particles[a].y - particles[b].y) ** 2);
                    
                    if (distanceSq < connectDistance) {
                        const opacityValue = 1 - (distanceSq / 20000);
                        if (distanceSq < highlightDistance) {
                             ctx!.strokeStyle = lineHighlightColor;
                             ctx!.lineWidth = 1.5;
                        } else {
                            ctx!.strokeStyle = lineColor.replace(/[\d\.]+\)$/g, `${Math.max(0, opacityValue)})`);
                            ctx!.lineWidth = 1;
                        }
                        ctx!.beginPath();
                        ctx!.moveTo(particles[a].x, particles[a].y);
                        ctx!.lineTo(particles[b].x, particles[b].y);
                        ctx!.stroke();
                    }
                }
            }
        };
        
        const updateRipples = () => {
            ripplesRef.current = ripplesRef.current.filter(ripple => {
                ripple.radius += 2; // speed of ripple expansion
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
            window.removeEventListener('mousedown', initAudio);
            window.removeEventListener('touchstart', initAudio);
            if(clickEffectEnabled) {
                window.removeEventListener('mousedown', handleMouseDown);
            }
            if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [
        nodeColor, 
        lineColor, 
        nodeDensity, 
        nodeSize, 
        playTone, 
        highlightColor, 
        lineHighlightColor, 
        mouseRepelStrength, 
        clickEffectEnabled
    ]);

    return <canvas ref={canvasRef} style={{ background: backgroundColor }} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default InteractiveMesh;
