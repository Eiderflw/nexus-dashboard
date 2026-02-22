'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // --- Nebula Configuration ---
        let particles: Particle[] = [];
        const PARTICLE_COUNT = 100; // Increased count
        const CONNECTION_DISTANCE = 180;

        // --- Matrix Configuration ---
        const fontSize = 16;
        const columns = Math.ceil(width / fontSize);
        const drops: number[] = []; // Array of y positions for each column
        // Initialize drops
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100; // Start above screen randomly
        }
        const matrixChars = "01アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slightly faster
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 1; // Larger particles
                // Brighter neon colors
                const colors = ['#34d399', '#22d3ee', '#a78bfa', '#f472b6'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        const init = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Re-init particles
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }

            // Re-init matrix drops
            const newColumns = Math.ceil(width / fontSize);
            // Preserve existing drops if possible, extend if wider
            for (let i = 0; i < newColumns; i++) {
                if (drops[i] === undefined) {
                    drops[i] = Math.random() * -100;
                }
            }
        };

        const animate = () => {
            if (!ctx) return;

            // Clear with slight fade for trail effect (Matrix style)
            // But we need to be careful not to smear the nebula too much.
            // Using a darker clear for Matrix, standard clear for Nebula might be tricky on one canvas.
            // Solution: Draw Matrix first with fade, then Nebula on top.

            ctx.fillStyle = 'rgba(2, 6, 23, 0.05)'; // Slate-950 with opacity for trail
            ctx.fillRect(0, 0, width, height);

            // --- Draw Matrix Rain ---
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));

                // Random brightness flicker
                const isBright = Math.random() > 0.98;
                ctx.fillStyle = isBright ? '#ffffff' : '#0ea5e9'; // White flash or Cyan rain (Sci-Fi)

                // Only draw some characters to avoid overwhelming
                if (Math.random() > 0.5) {
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                }

                // Reset drop to top randomly after it crosses screen
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drop down
                drops[i]++;
            }

            // --- Draw Nebula/DNA ---
            // We want the nebula to be cleaner, so we might need to redraw dots without trails if possible,
            // but the fade rect above affects everything. 
            // The fade rect actually creates the Matrix trail. The particles will also trail.
            // Let's see if that looks cool (DNA tracers). If not, we'd need two canvases.
            // For now, let's keep it simple. DNA tracers might look like "movement".

            particles.forEach((p1, i) => {
                p1.update();
                p1.draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < CONNECTION_DISTANCE) {
                        ctx.beginPath();
                        // Cyan/Purple gradient lines
                        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                        gradient.addColorStop(0, p1.color);
                        gradient.addColorStop(1, p2.color);
                        ctx.strokeStyle = gradient;
                        ctx.globalAlpha = 1 - distance / CONNECTION_DISTANCE;
                        ctx.lineWidth = 1;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1; // Reset alpha
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', init);
        init();
        animate();

        return () => {
            window.removeEventListener('resize', init);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none opacity-60 bg-slate-950"
        />
    );
}
