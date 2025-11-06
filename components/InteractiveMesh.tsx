
import React, { useRef, useEffect, useCallback } from 'react';

// Admin-editable props would be passed here
interface InteractiveMeshProps {
    backgroundColor?: string;
    nodeColor?: string;
    lineColor?: string;
    nodeDensity?: number; // e.g. 1 particle per 10000 pixels
    nodeSize?: number;
    toneVolume?: number;
}

const InteractiveMesh: React.FC<InteractiveMeshProps> = ({
    backgroundColor = '#0f172a', // slate-900
    nodeColor = 'rgba(45, 212, 191, 0.8)', // teal-400
    lineColor = 'rgba(45, 212, 191, 0.3)', // teal-400
    nodeDensity = 10000,
    nodeSize = 2,
    toneVolume = 0.05
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playTone = useCallback((x: number, y: number) => {
        if (!audioContextRef.current) return;
        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();
        
        // Map position to frequency for variation
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
        
        // Initialize AudioContext on first user interaction (or component mount)
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
            mouse.x = event.x;
            mouse.y = event.y;
        };
        window.addEventListener('mousemove', handleMouseMove);

        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            speed: number;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.speed = Math.random() * 0.4 + 0.1;
            }

            draw() {
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx!.fillStyle = nodeColor;
                ctx!.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

                this.x += this.directionX * this.speed;
                this.y += this.directionY * this.speed;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= forceDirectionX * force * 2;
                        this.y -= forceDirectionY * force * 2;

                        if(Math.random() < 0.01) { // Play tone sparingly
                            playTone(this.x, this.y);
                        }
                    }
                }

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
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                                   + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx!.strokeStyle = lineColor.replace('0.3', opacityValue.toString());
                        ctx!.lineWidth = 1;
                        ctx!.beginPath();
                        ctx!.moveTo(particles[a].x, particles[a].y);
                        ctx!.lineTo(particles[b].x, particles[b].y);
                        ctx!.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx!.clearRect(0, 0, canvas.width, canvas.height);
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
            if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [nodeColor, lineColor, nodeDensity, nodeSize, playTone]);

    return <canvas ref={canvasRef} style={{ background: backgroundColor }} className="absolute top-0 left-0 w-full h-full z-0" />;
};

export default InteractiveMesh;
