import { useEffect, useRef, useState } from 'react';
import { getConceptPalette, seededRandom } from '../utils/colors';

/**
 * Mesmerizing continuous canvas animation — oddly satisfying patterns.
 * OPTIMIZED: Only animates when visible via IntersectionObserver.
 * Throttled to ~30fps instead of 60fps for half the CPU cost.
 */

function hslToRgba(h, s, l, a) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const f = n => l - (s * Math.min(l, 1 - l)) * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return `rgba(${Math.round(f(0) * 255)},${Math.round(f(8) * 255)},${Math.round(f(4) * 255)},${a})`;
}

/* ────── Wave Interference ────── */
function drawWaves(ctx, w, h, t, seed) {
    const waveCount = 4; // Reduced from 5
    const baseHue = seed * 360;

    for (let i = 0; i < waveCount; i++) {
        const freq = 0.008 + i * 0.003;
        const amp = 30 + i * 15;
        const speed = (0.3 + i * 0.15) * (i % 2 === 0 ? 1 : -1);
        const yOffset = h * (0.25 + i * 0.12);
        const hue = (baseHue + i * 35) % 360;

        ctx.beginPath();
        ctx.moveTo(0, h);

        // Reduced resolution: step by 6 instead of 3
        for (let x = 0; x <= w; x += 6) {
            const y = yOffset
                + Math.sin(x * freq + t * speed) * amp
                + Math.sin(x * freq * 1.7 + t * speed * 0.6 + i) * amp * 0.5;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, yOffset - amp, 0, yOffset + amp * 2);
        grad.addColorStop(0, hslToRgba(hue, 70, 60, 0.06));
        grad.addColorStop(1, hslToRgba(hue, 70, 40, 0.02));
        ctx.fillStyle = grad;
        ctx.fill();
    }
}

/* ────── Spiral Galaxy (simplified) ────── */
function drawSpiral(ctx, w, h, t, seed) {
    const cx = w / 2;
    const cy = h / 2;
    const arms = 3;
    const baseHue = seed * 360;
    const maxR = Math.min(w, h) * 0.42;

    for (let arm = 0; arm < arms; arm++) {
        const armAngle = (arm / arms) * Math.PI * 2;

        // Reduced from 80 to 40 particles
        for (let i = 0; i < 40; i++) {
            const progress = i / 40;
            const r = progress * maxR;
            const angle = armAngle + progress * Math.PI * 3 + t * 0.3;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;

            const size = 1 + (1 - progress) * 2;
            const alpha = (1 - progress * 0.8) * 0.5;
            const hue = (baseHue + progress * 60 + arm * 40) % 360;

            ctx.beginPath();
            ctx.fillStyle = hslToRgba(hue, 70, 65, alpha);
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/* ────── Breathing Mandala (simplified) ────── */
function drawMandala(ctx, w, h, t, seed) {
    const cx = w / 2;
    const cy = h / 2;
    const layers = 3; // Reduced from 4
    const baseHue = seed * 360;

    for (let layer = 0; layer < layers; layer++) {
        const petals = 6 + layer * 3;
        const breathe = 1 + Math.sin(t * 0.8 + layer * 0.7) * 0.2;
        const baseR = (40 + layer * 30) * breathe;
        const rotation = t * (0.15 + layer * 0.05) * (layer % 2 === 0 ? 1 : -1);
        const hue = (baseHue + layer * 40) % 360;

        ctx.strokeStyle = hslToRgba(hue, 60, 60, 0.2);
        ctx.lineWidth = 1.5;

        for (let p = 0; p < petals; p++) {
            const angle = (p / petals) * Math.PI * 2 + rotation;
            const petalPulse = 1 + Math.sin(t * 1.5 + p * 0.5 + layer) * 0.15;

            ctx.beginPath();
            // Reduced control points from 30 to 15
            for (let i = 0; i <= 15; i++) {
                const pt = i / 15;
                const petalAngle = angle - 0.3 + pt * 0.6;
                const r = baseR * Math.sin(pt * Math.PI) * petalPulse;
                const x = cx + Math.cos(petalAngle) * r;
                const y = cy + Math.sin(petalAngle) * r;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    }
}

/* ────── Liquid Mesh (simplified) ────── */
function drawMesh(ctx, w, h, t, seed) {
    const cols = 8; // Reduced from 12
    const rows = 8;
    const spacingX = w / (cols - 1);
    const spacingY = h / (rows - 1);
    const baseHue = seed * 360;

    const points = [];
    for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
            const dx = Math.sin(t * 0.5 + c * 0.4 + r * 0.3) * 15;
            const dy = Math.cos(t * 0.4 + r * 0.4 + c * 0.2) * 15;
            points[r][c] = { x: c * spacingX + dx, y: r * spacingY + dy };
        }
    }

    // Draw grid lines
    for (let r = 0; r < rows; r++) {
        ctx.strokeStyle = hslToRgba((baseHue + r * 10) % 360, 50, 55, 0.1);
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
    for (let c = 0; c < cols; c++) {
        ctx.strokeStyle = hslToRgba((baseHue + 60 + c * 10) % 360, 50, 55, 0.1);
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
            const p = points[r][c];
            r === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }
}

const allDrawFunctions = [drawWaves, drawSpiral, drawMandala, drawMesh];

export default function MesmerizeCanvas({ concept, atomType }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // IntersectionObserver — only animate when visible
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(canvas);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) {
            // Pause when off-screen
            if (animRef.current) cancelAnimationFrame(animRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const seed = Math.random(); // Random seed per card for unique colors
        const drawFn = allDrawFunctions[Math.floor(Math.random() * allDrawFunctions.length)];

        let dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        let time = 0;
        let lastFrame = 0;
        const TARGET_FPS = 30; // Throttle to 30fps
        const FRAME_TIME = 1000 / TARGET_FPS;

        const animate = (timestamp) => {
            if (timestamp - lastFrame < FRAME_TIME) {
                animRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrame = timestamp;

            const cw = canvas.width / dpr;
            const ch = canvas.height / dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, cw, ch);
            time += 0.02; // ~30fps step
            drawFn(ctx, cw, ch, time, seed);
            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animRef.current);
    }, [isVisible, concept, atomType]);

    return <canvas ref={canvasRef} className="mesmerize-canvas" />;
}
