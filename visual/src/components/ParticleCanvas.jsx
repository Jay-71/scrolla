import { useEffect, useRef } from 'react';
import { getConceptPalette } from '../utils/colors';

/**
 * Floating particle canvas with constellation lines + mouse interaction.
 * Renders behind card content, auto-pauses when offscreen.
 */
export default function ParticleCanvas({ concept, atomType }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const animRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const palette = getConceptPalette(concept);
        const PARTICLE_COUNT = 45;
        const CONNECTION_DIST = 120;
        const MOUSE_RADIUS = 150;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();

        // Init particles
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: 1.5 + Math.random() * 2.5,
            color: palette.particleColors[i % palette.particleColors.length],
            pulse: Math.random() * Math.PI * 2,
        }));

        const handlePointer = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        const handleLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        canvas.addEventListener('pointermove', handlePointer);
        canvas.addEventListener('pointerleave', handleLeave);

        let time = 0;

        const animate = () => {
            const cw = canvas.offsetWidth;
            const ch = canvas.offsetHeight;
            ctx.clearRect(0, 0, cw, ch);
            time += 0.01;

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse repulsion
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.8;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                }

                // Damping
                p.vx *= 0.98;
                p.vy *= 0.98;

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < -10) p.x = cw + 10;
                if (p.x > cw + 10) p.x = -10;
                if (p.y < -10) p.y = ch + 10;
                if (p.y > ch + 10) p.y = -10;

                // Pulsing glow
                const pulseScale = 1 + Math.sin(time * 2 + p.pulse) * 0.3;
                const r = p.radius * pulseScale;

                // Draw glow
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
                ctx.fill();

                // Draw core
                ctx.beginPath();
                ctx.fillStyle = p.color.replace(/[\d.]+\)$/, '0.9)');
                ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Draw constellation lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
                        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animate();

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        return () => {
            cancelAnimationFrame(animRef.current);
            canvas.removeEventListener('pointermove', handlePointer);
            canvas.removeEventListener('pointerleave', handleLeave);
            resizeObserver.disconnect();
        };
    }, [concept, atomType]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'auto',
            }}
        />
    );
}
