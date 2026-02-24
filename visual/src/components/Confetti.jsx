import { useEffect, useRef, useCallback } from 'react';

/**
 * Lightweight canvas confetti burst.
 * Physics-based particles with gravity, rotation, and drag.
 * Auto-cleans after ~2.5 seconds.
 */
export default function Confetti({ trigger, colors }) {
    const canvasRef = useRef(null);
    const prevTrigger = useRef(trigger);

    const burst = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        ctx.scale(2, 2);

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        const cx = w / 2;
        const cy = h * 0.4;

        const defaultColors = [
            '#818cf8', '#f472b6', '#34d399', '#fbbf24',
            '#60a5fa', '#c084fc', '#fb923c', '#2dd4bf',
        ];
        const palette = colors || defaultColors;

        const PARTICLE_COUNT = 60;
        const particles = Array.from({ length: PARTICLE_COUNT }, () => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 6;
            return {
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                width: 4 + Math.random() * 6,
                height: 3 + Math.random() * 4,
                color: palette[Math.floor(Math.random() * palette.length)],
                gravity: 0.12 + Math.random() * 0.06,
                drag: 0.98 + Math.random() * 0.015,
                opacity: 1,
                decay: 0.008 + Math.random() * 0.008,
            };
        });

        let frame;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            let alive = false;

            for (const p of particles) {
                if (p.opacity <= 0) continue;
                alive = true;

                p.vy += p.gravity;
                p.vx *= p.drag;
                p.vy *= p.drag;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.decay;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
                ctx.restore();
            }

            if (alive) {
                frame = requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, w, h);
            }
        };

        animate();
        return () => cancelAnimationFrame(frame);
    }, [colors]);

    useEffect(() => {
        if (trigger && trigger !== prevTrigger.current) {
            prevTrigger.current = trigger;
            burst();
        }
    }, [trigger, burst]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                zIndex: 50,
                pointerEvents: 'none',
            }}
        />
    );
}
