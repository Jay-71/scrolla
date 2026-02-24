import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Procedural animated background — vibrant, energetic SVG animations.
 * High saturation neon colors, fast motion, bold presence.
 */

function rand() { return Math.random(); }
function randRange(min, max) { return min + rand() * (max - min); }
function neonColor() {
    // Pure neon palette — electric, not calming
    const neons = [
        'hsl(280, 100%, 65%)',  // electric purple
        'hsl(320, 100%, 60%)',  // hot pink
        'hsl(180, 100%, 55%)',  // cyan
        'hsl(140, 100%, 50%)',  // neon green
        'hsl(40, 100%, 55%)',   // amber
        'hsl(200, 100%, 60%)',  // electric blue
        'hsl(340, 100%, 55%)',  // magenta
        'hsl(60, 100%, 55%)',   // neon yellow
        'hsl(260, 100%, 70%)',  // violet
        'hsl(160, 100%, 50%)',  // mint neon
    ];
    return neons[Math.floor(rand() * neons.length)];
}

// Recipe 1: Neon Orbiting Rings
function NeonOrbits() {
    const circles = useMemo(() =>
        Array.from({ length: Math.floor(randRange(5, 10)) }, (_, i) => ({
            r: randRange(3, 8),
            orbitR: randRange(12, 45),
            color: neonColor(),
            duration: randRange(4, 12),
            delay: rand() * -15,
            opacity: randRange(0.4, 0.8),
            glowR: randRange(6, 14),
        }))
        , []);

    return (
        <svg viewBox="0 0 100 100" className="proc-svg">
            <defs>
                {circles.map((c, i) => (
                    <filter key={`f${i}`} id={`glow${i}`}>
                        <feGaussianBlur stdDeviation={c.glowR / 4} result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                ))}
            </defs>
            {circles.map((c, i) => (
                <circle key={i} r={c.r} fill={c.color} opacity={c.opacity} filter={`url(#glow${i})`}>
                    <animateMotion
                        dur={`${c.duration}s`}
                        repeatCount="indefinite"
                        begin={`${c.delay}s`}
                        path={`M ${50 + c.orbitR} 50 A ${c.orbitR} ${c.orbitR} 0 1 1 ${50 - c.orbitR} 50 A ${c.orbitR} ${c.orbitR} 0 1 1 ${50 + c.orbitR} 50`}
                    />
                    <animate attributeName="r" values={`${c.r};${c.r * 1.5};${c.r}`} dur="2s" repeatCount="indefinite" />
                </circle>
            ))}
        </svg>
    );
}

// Recipe 2: Electric Pulse Grid
function ElectricGrid() {
    const lines = useMemo(() => {
        const arr = [];
        for (let i = 0; i < 8; i++) {
            arr.push({
                x: 12.5 * i, color: neonColor(),
                duration: randRange(1.5, 4), delay: rand() * 3,
                opacity: randRange(0.3, 0.6),
            });
            arr.push({
                y: 12.5 * i, color: neonColor(),
                duration: randRange(1.5, 4), delay: rand() * 3,
                opacity: randRange(0.3, 0.6),
            });
        }
        return arr;
    }, []);

    const pulses = useMemo(() =>
        Array.from({ length: 6 }, () => ({
            x: randRange(0, 100), y: randRange(0, 100),
            color: neonColor(), duration: randRange(1, 3),
            delay: rand() * 5, r: randRange(1, 3),
        }))
        , []);

    return (
        <svg viewBox="0 0 100 100" className="proc-svg">
            {lines.map((l, i) =>
                l.x !== undefined ? (
                    <line key={i} x1={l.x} y1="0" x2={l.x} y2="100"
                        stroke={l.color} strokeWidth="0.3" opacity={l.opacity}>
                        <animate attributeName="opacity" values={`${l.opacity};${l.opacity * 2};${l.opacity}`}
                            dur={`${l.duration}s`} repeatCount="indefinite" begin={`${l.delay}s`} />
                    </line>
                ) : (
                    <line key={i} x1="0" y1={l.y} x2="100" y2={l.y}
                        stroke={l.color} strokeWidth="0.3" opacity={l.opacity}>
                        <animate attributeName="opacity" values={`${l.opacity};${l.opacity * 2};${l.opacity}`}
                            dur={`${l.duration}s`} repeatCount="indefinite" begin={`${l.delay}s`} />
                    </line>
                )
            )}
            {pulses.map((p, i) => (
                <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity="0">
                    <animate attributeName="opacity" values="0;0.8;0" dur={`${p.duration}s`}
                        repeatCount="indefinite" begin={`${p.delay}s`} />
                    <animate attributeName="r" values={`${p.r};${p.r * 4};${p.r}`} dur={`${p.duration}s`}
                        repeatCount="indefinite" begin={`${p.delay}s`} />
                </circle>
            ))}
        </svg>
    );
}

// Recipe 3: Meteor Shower
function MeteorShower() {
    const meteors = useMemo(() =>
        Array.from({ length: Math.floor(randRange(8, 15)) }, () => {
            const startX = randRange(-10, 110);
            const startY = randRange(-20, 30);
            const angle = randRange(20, 50);
            const len = randRange(40, 80);
            const endX = startX + Math.cos(angle * Math.PI / 180) * len;
            const endY = startY + Math.sin(angle * Math.PI / 180) * len;
            return {
                x1: startX, y1: startY, x2: endX, y2: endY,
                color: neonColor(), duration: randRange(1, 3),
                delay: rand() * 8, width: randRange(0.3, 1),
                opacity: randRange(0.4, 0.9),
            };
        })
        , []);

    return (
        <svg viewBox="0 0 100 100" className="proc-svg">
            <defs>
                {meteors.map((m, i) => (
                    <linearGradient key={i} id={`mg${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={m.color} stopOpacity="0" />
                        <stop offset="60%" stopColor={m.color} stopOpacity={m.opacity} />
                        <stop offset="100%" stopColor="#fff" stopOpacity={m.opacity} />
                    </linearGradient>
                ))}
            </defs>
            {meteors.map((m, i) => (
                <line key={i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2}
                    stroke={`url(#mg${i})`} strokeWidth={m.width} strokeLinecap="round"
                    opacity="0">
                    <animate attributeName="opacity" values="0;1;0"
                        dur={`${m.duration}s`} repeatCount="indefinite" begin={`${m.delay}s`} />
                </line>
            ))}
        </svg>
    );
}

// Recipe 4: Neon Burst Rings
function BurstRings() {
    const rings = useMemo(() =>
        Array.from({ length: Math.floor(randRange(5, 9)) }, () => ({
            cx: randRange(20, 80), cy: randRange(20, 80),
            maxR: randRange(8, 25), color: neonColor(),
            duration: randRange(2, 5), delay: rand() * 6,
            strokeWidth: randRange(0.3, 1),
        }))
        , []);

    return (
        <svg viewBox="0 0 100 100" className="proc-svg">
            {rings.map((r, i) => (
                <circle key={i} cx={r.cx} cy={r.cy} fill="none"
                    stroke={r.color} strokeWidth={r.strokeWidth}>
                    <animate attributeName="r" values={`0;${r.maxR}`}
                        dur={`${r.duration}s`} repeatCount="indefinite" begin={`${r.delay}s`} />
                    <animate attributeName="opacity" values="0.8;0"
                        dur={`${r.duration}s`} repeatCount="indefinite" begin={`${r.delay}s`} />
                </circle>
            ))}
        </svg>
    );
}

// Recipe 5: Plasma Blobs
function PlasmaBlobs() {
    const blobs = useMemo(() =>
        Array.from({ length: Math.floor(randRange(5, 10)) }, () => ({
            cx: randRange(10, 90), cy: randRange(10, 90),
            r: randRange(5, 18), color: neonColor(),
            dx: randRange(-20, 20), dy: randRange(-20, 20),
            duration: randRange(4, 10), delay: rand() * -8,
            opacity: randRange(0.2, 0.5),
        }))
        , []);

    return (
        <svg viewBox="0 0 100 100" className="proc-svg">
            <defs>
                <filter id="plasma-blur">
                    <feGaussianBlur stdDeviation="3" />
                </filter>
            </defs>
            <g filter="url(#plasma-blur)">
                {blobs.map((b, i) => (
                    <circle key={i} r={b.r} fill={b.color} opacity={b.opacity}>
                        <animate attributeName="cx" values={`${b.cx};${b.cx + b.dx};${b.cx}`}
                            dur={`${b.duration}s`} repeatCount="indefinite" begin={`${b.delay}s`} />
                        <animate attributeName="cy" values={`${b.cy};${b.cy + b.dy};${b.cy}`}
                            dur={`${b.duration}s`} repeatCount="indefinite" begin={`${b.delay}s`} />
                        <animate attributeName="r" values={`${b.r};${b.r * 1.4};${b.r}`}
                            dur={`${b.duration * 0.7}s`} repeatCount="indefinite" />
                    </circle>
                ))}
            </g>
        </svg>
    );
}

const RECIPES = [NeonOrbits, ElectricGrid, MeteorShower, BurstRings, PlasmaBlobs];

export default function ProceduralBackground() {
    const Recipe = useMemo(() => RECIPES[Math.floor(rand() * RECIPES.length)], []);

    return (
        <motion.div
            className="procedural-bg-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 1 }}
        >
            <Recipe />
        </motion.div>
    );
}
