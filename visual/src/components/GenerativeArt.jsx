import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getConceptPalette } from '../utils/colors';

/**
 * Parametric Generative Art — BOLD neon edition.
 * 10 recipes × infinite random parameters. Vibrant, punchy, eye-catching.
 */

const R = () => Math.random();
const RR = (min, max) => min + R() * (max - min);
const RI = (min, max) => Math.floor(RR(min, max));

// Vibrant neon palette — never dull
const NEONS = [
    '#ff2d55', '#ff3b30', '#ff9500', '#ffcc00', '#4cd964',
    '#5ac8fa', '#007aff', '#5856d6', '#af52de', '#ff2d95',
    '#00e5ff', '#76ff03', '#ff6d00', '#d500f9', '#1de9b6',
    '#f50057', '#651fff', '#00b0ff', '#69f0ae', '#ffd740',
];

function neon() { return NEONS[RI(0, NEONS.length)]; }
function neonSet(n) { return Array.from({ length: n }, () => neon()); }

// The SVG glow filter used by all recipes
const GLOW_FILTER = (
    <defs>
        <filter id="artGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
);

// ─── 1. Constellation ────────────────────────────────
function Constellation() {
    const colors = useMemo(() => neonSet(3), []);
    const nodes = useMemo(() => Array.from({ length: RI(7, 15) }, () => ({
        x: RR(15, 185), y: RR(15, 185), r: RR(3, 7), color: colors[RI(0, 3)],
        dur: RR(1.5, 4), delay: RR(0, 2),
    })), []);
    const edges = useMemo(() => {
        const e = [];
        nodes.forEach((a, i) => nodes.forEach((b, j) => {
            if (j <= i) return;
            if (Math.hypot(a.x - b.x, a.y - b.y) < RR(55, 95))
                e.push({ a, b, color: colors[RI(0, 3)], dur: RR(2, 5) });
        }));
        return e;
    }, [nodes]);
    return (<g filter="url(#artGlow)">
        {edges.map((e, i) => <motion.line key={`e${i}`} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y}
            stroke={e.color} strokeWidth={1.2} animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: e.dur, repeat: Infinity }} />)}
        {nodes.map((n, i) => <motion.circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.color}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: n.dur, repeat: Infinity, delay: n.delay }} />)}
    </g>);
}

// ─── 2. Nested Polygons ──────────────────────────────
function NestedPolygons() {
    const colors = useMemo(() => neonSet(5), []);
    const polys = useMemo(() => Array.from({ length: RI(3, 7) }, (_, i) => {
        const sides = RI(3, 9);
        const r = 18 + i * RR(14, 22);
        const pts = Array.from({ length: sides }, (_, j) => {
            const a = (j / sides) * Math.PI * 2 - Math.PI / 2;
            return `${100 + Math.cos(a) * r},${100 + Math.sin(a) * r}`;
        }).join(' ');
        return { pts, color: colors[i % 5], dur: RR(6, 16), dir: R() > 0.5 ? 360 : -360, w: RR(1.2, 2.5) };
    }), []);
    return (<g filter="url(#artGlow)">
        {polys.map((p, i) => <motion.polygon key={i} points={p.pts} fill="none" stroke={p.color}
            strokeWidth={p.w} opacity={0.7} animate={{ rotate: [0, p.dir] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '100px 100px' }} />)}
    </g>);
}

// ─── 3. Spiral Dots ──────────────────────────────────
function SpiralDots() {
    const colors = useMemo(() => neonSet(4), []);
    const arms = RI(2, 5);
    const dotsPerArm = RI(12, 28);
    const tightness = RR(2.5, 5);
    const dots = useMemo(() => {
        const d = [];
        for (let arm = 0; arm < arms; arm++) {
            const offset = (arm / arms) * Math.PI * 2;
            for (let i = 0; i < dotsPerArm; i++) {
                const t = i / dotsPerArm;
                const angle = offset + t * Math.PI * tightness;
                const r = t * 85;
                d.push({
                    x: 100 + Math.cos(angle) * r, y: 100 + Math.sin(angle) * r,
                    size: RR(2, 6) * (1 - t * 0.4), color: colors[arm % 4],
                    delay: i * 0.04, dur: RR(1.5, 3),
                });
            }
        }
        return d;
    }, []);
    return (<g filter="url(#artGlow)">
        {dots.map((d, i) => <motion.circle key={i} cx={d.x} cy={d.y} r={d.size} fill={d.color}
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.4, 1] }}
            transition={{ duration: d.dur, repeat: Infinity, delay: d.delay }} />)}
    </g>);
}

// ─── 4. Ripple Circles ───────────────────────────────
function RippleCircles() {
    const colors = useMemo(() => neonSet(3), []);
    const cx = RR(60, 140), cy = RR(60, 140);
    const count = RI(5, 10);
    const maxR = RR(50, 90);
    return (<g filter="url(#artGlow)">
        {Array.from({ length: count }, (_, i) => (
            <motion.circle key={i} cx={cx} cy={cy} fill="none"
                stroke={colors[i % 3]} strokeWidth={RR(1, 2.5)}
                animate={{ r: [0, maxR], opacity: [0.8, 0] }}
                transition={{ duration: RR(2, 4), repeat: Infinity, delay: i * RR(0.2, 0.6), ease: 'easeOut' }} />
        ))}
        <motion.circle cx={cx} cy={cy} r={5} fill={colors[0]}
            animate={{ scale: [1, 1.6, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
    </g>);
}

// ─── 5. Wave Lines ───────────────────────────────────
function WaveLines() {
    const colors = useMemo(() => neonSet(6), []);
    const waves = useMemo(() => Array.from({ length: RI(4, 8) }, (_, i) => {
        const yBase = 25 + i * RR(20, 30);
        const amp = RR(10, 30);
        const freq = RR(0.03, 0.09);
        const phase = RR(0, Math.PI * 2);
        const pts = Array.from({ length: 50 }, (_, j) => {
            const x = (j / 49) * 200;
            return `${x},${yBase + Math.sin(x * freq + phase) * amp}`;
        }).join(' ');
        return { pts, color: colors[i % 6], w: RR(1.2, 2.5), dur: RR(2, 5), delay: i * 0.15 };
    }), []);
    return (<g filter="url(#artGlow)">
        {waves.map((w, i) => <motion.polyline key={i} points={w.pts} fill="none"
            stroke={w.color} strokeWidth={w.w} strokeLinecap="round"
            animate={{ opacity: [0.3, 0.75, 0.3] }}
            transition={{ duration: w.dur, repeat: Infinity, delay: w.delay }} />)}
    </g>);
}

// ─── 6. Particle Cloud ───────────────────────────────
function ParticleCloud() {
    const colors = useMemo(() => neonSet(5), []);
    const particles = useMemo(() => Array.from({ length: RI(25, 55) }, (_, i) => ({
        x: RR(10, 190), y: RR(10, 190), r: RR(1.5, 5), color: colors[i % 5],
        dx: RR(-20, 20), dy: RR(-20, 20), dur: RR(2, 6), delay: RR(0, 3),
    })), []);
    return (<g filter="url(#artGlow)">
        {particles.map((p, i) => <motion.circle key={i} r={p.r} fill={p.color}
            animate={{ cx: [p.x, p.x + p.dx, p.x], cy: [p.y, p.y + p.dy, p.y], opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />)}
    </g>);
}

// ─── 7. Circuit Paths ────────────────────────────────
function CircuitPaths() {
    const colors = useMemo(() => neonSet(4), []);
    const paths = useMemo(() => Array.from({ length: RI(6, 14) }, (_, idx) => {
        let x = RR(20, 180), y = RR(20, 180);
        const segs = RI(3, 7);
        let d = `M${x},${y}`;
        for (let s = 0; s < segs; s++) {
            if (R() > 0.5) x += RR(-45, 45); else y += RR(-45, 45);
            x = Math.max(5, Math.min(195, x)); y = Math.max(5, Math.min(195, y));
            d += ` L${x},${y}`;
        }
        return {
            d, color: colors[idx % 4], w: RR(1, 2.5), dur: RR(2, 5), delay: RR(0, 2),
            nodeX: x, nodeY: y, nodeR: RR(3, 6)
        };
    }), []);
    return (<g filter="url(#artGlow)">
        {paths.map((p, i) => <g key={i}>
            <motion.path d={p.d} fill="none" stroke={p.color} strokeWidth={p.w} strokeLinecap="round"
                animate={{ opacity: [0.2, 0.7, 0.2], pathLength: [0, 1, 0] }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }} />
            <motion.circle cx={p.nodeX} cy={p.nodeY} r={p.nodeR} fill={p.color}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: p.delay }} />
        </g>)}
    </g>);
}

// ─── 8. Fractal Tree ─────────────────────────────────
function FractalTree() {
    const colors = useMemo(() => neonSet(4), []);
    const branches = useMemo(() => {
        const b = [];
        function grow(x, y, angle, len, depth) {
            if (depth > RI(3, 5) || len < 6) return;
            const x2 = x + Math.cos(angle) * len;
            const y2 = y + Math.sin(angle) * len;
            b.push({
                x1: x, y1: y, x2, y2, w: Math.max(0.8, 3 - depth * 0.5),
                color: colors[depth % 4], dur: RR(2, 4), delay: depth * 0.2
            });
            const spread = RR(0.3, 0.9);
            grow(x2, y2, angle - spread, len * RR(0.6, 0.8), depth + 1);
            grow(x2, y2, angle + spread, len * RR(0.6, 0.8), depth + 1);
            if (R() > 0.4) grow(x2, y2, angle, len * RR(0.5, 0.7), depth + 1);
        }
        grow(100, 190, -Math.PI / 2, RR(35, 55), 0);
        return b;
    }, []);
    return (<g filter="url(#artGlow)">
        {branches.map((b, i) => <motion.line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
            stroke={b.color} strokeWidth={b.w} strokeLinecap="round"
            animate={{ opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: b.dur, repeat: Infinity, delay: b.delay }} />)}
    </g>);
}

// ─── 9. Mandala Flower ───────────────────────────────
function MandalaFlower() {
    const colors = useMemo(() => neonSet(5), []);
    const petals = RI(5, 13);
    const layers = RI(2, 5);
    const items = useMemo(() => {
        const arr = [];
        for (let l = 0; l < layers; l++) {
            const r = 18 + l * RR(16, 28);
            const petalCount = petals + l * RI(0, 4);
            for (let p = 0; p < petalCount; p++) {
                const angle = (p / petalCount) * Math.PI * 2;
                arr.push({
                    x: 100 + Math.cos(angle) * r, y: 100 + Math.sin(angle) * r,
                    r2: RR(3, 8), shape: RI(0, 3), color: colors[(l + p) % 5],
                    dur: RR(1.5, 4), delay: l * 0.2 + p * 0.04,
                });
            }
        }
        return arr;
    }, []);
    return (<g filter="url(#artGlow)">
        {items.map((item, i) => {
            if (item.shape === 0) return (
                <motion.circle key={i} cx={item.x} cy={item.y} r={item.r2} fill={item.color}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: item.dur, repeat: Infinity, delay: item.delay }} />
            );
            if (item.shape === 1) return (
                <motion.rect key={i} x={item.x - item.r2 / 2} y={item.y - item.r2 / 2}
                    width={item.r2} height={item.r2} fill={item.color}
                    animate={{ rotate: [0, 360], opacity: [0.5, 1, 0.5] }}
                    transition={{
                        rotate: { duration: item.dur * 3, repeat: Infinity, ease: 'linear' },
                        opacity: { duration: item.dur, repeat: Infinity, delay: item.delay }
                    }}
                    style={{ transformOrigin: `${item.x}px ${item.y}px` }} />
            );
            return (
                <motion.line key={i} x1={100} y1={100} x2={item.x} y2={item.y}
                    stroke={item.color} strokeWidth={1.2}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: item.dur, repeat: Infinity, delay: item.delay }} />
            );
        })}
    </g>);
}

// ─── 10. Orbit System ────────────────────────────────
function OrbitSystem() {
    const colors = useMemo(() => neonSet(6), []);
    const orbits = useMemo(() => Array.from({ length: RI(3, 7) }, (_, i) => ({
        r: 14 + i * RR(13, 22), dotR: RR(3, 7), color: colors[i % 6],
        dur: RR(4, 15), dir: R() > 0.5 ? 1 : -1, dashLen: RR(5, 25),
        ringColor: colors[(i + 2) % 6], ringW: RR(0.8, 1.8),
    })), []);
    return (<g filter="url(#artGlow)">
        {orbits.map((o, i) => <g key={i}>
            <circle cx={100} cy={100} r={o.r} fill="none" stroke={o.ringColor}
                strokeWidth={o.ringW} strokeDasharray={`${o.dashLen} ${o.dashLen * 0.5}`} opacity={0.4} />
            <motion.circle cx={100 + o.r} cy={100} r={o.dotR} fill={o.color} opacity={0.9}
                animate={{ rotate: [0, 360 * o.dir] }}
                transition={{ duration: o.dur, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '100px 100px' }} />
        </g>)}
        <motion.circle cx={100} cy={100} r={6} fill={colors[0]}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
    </g>);
}

// ─── All recipes ─────────────────────────────────────
const ALL_RECIPES = [
    Constellation, NestedPolygons, SpiralDots, RippleCircles, WaveLines,
    ParticleCloud, CircuitPaths, FractalTree, MandalaFlower, OrbitSystem,
];

export default function GenerativeArt({ concept }) {
    const Recipe = useMemo(
        () => ALL_RECIPES[Math.floor(R() * ALL_RECIPES.length)],
        []
    );

    return (
        <div style={{
            width: '100%',
            maxWidth: 200,
            aspectRatio: '1',
            margin: '0 auto',
        }}>
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                {GLOW_FILTER}
                <Recipe />
            </svg>
        </div>
    );
}
