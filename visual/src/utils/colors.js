/**
 * Deterministic color generation from strings.
 * Hash any concept name → consistent unique HSL palette.
 */

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit int
    }
    return Math.abs(hash);
}

/**
 * Generate a full color palette from a concept string.
 * Returns { primary, secondary, accent, glow1, glow2, particleColors }
 */
export function getConceptPalette(concept) {
    const h = hashString(concept);
    const hue = h % 360;
    const hue2 = (hue + 40 + (h % 30)) % 360;
    const hue3 = (hue + 180 + (h % 40)) % 360;

    return {
        primary: `hsl(${hue}, 70%, 65%)`,
        secondary: `hsl(${hue2}, 60%, 55%)`,
        accent: `hsl(${hue3}, 80%, 70%)`,
        glow1: `hsla(${hue}, 80%, 60%, 0.3)`,
        glow2: `hsla(${hue2}, 70%, 50%, 0.25)`,
        bg1: `hsla(${hue}, 50%, 8%, 1)`,
        bg2: `hsla(${hue2}, 40%, 12%, 1)`,
        particleColors: [
            `hsla(${hue}, 70%, 65%, 0.6)`,
            `hsla(${hue2}, 60%, 55%, 0.5)`,
            `hsla(${hue3}, 80%, 70%, 0.4)`,
            `hsla(${(hue + 90) % 360}, 50%, 60%, 0.3)`,
        ],
    };
}

/**
 * Generate a seeded pseudo-random number from concept + index.
 */
export function seededRandom(concept, index = 0) {
    const h = hashString(concept + index);
    return (h % 10000) / 10000;
}

/**
 * Get type-specific accent colors
 */
export const typeAccents = {
    explanation: { hue: 245, color: '#818cf8', glow: 'rgba(129,140,248,0.4)' },
    example: { hue: 210, color: '#60a5fa', glow: 'rgba(96,165,250,0.4)' },
    question: { hue: 270, color: '#c084fc', glow: 'rgba(192,132,252,0.4)' },
    comparison: { hue: 170, color: '#2dd4bf', glow: 'rgba(45,212,191,0.4)' },
};
