import { seededRandom } from './colors';

const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;
const PIXABAY_URL = 'https://pixabay.com/api/';

const KEYWORDS = [
    'abstract background', 'neon geometric', 'fluid gradient', 'vibrant colorful',
    'digital art', 'techno pattern', 'futuristic texture', 'colorful smoke',
    'aurora borealis', 'cosmic galaxy', 'holographic waves', 'liquid metal',
    'fractal art', 'glowing particles', 'energy waves', 'crystal abstract',
    'space nebula', 'light trails', 'gradient mesh', 'psychedelic pattern',
    'bokeh lights', 'fire flames', 'underwater bubbles', 'northern lights',
    'stained glass', 'oil painting', 'watercolor splash', 'geometric mosaic',
    'circuit board', 'mandala pattern', 'vaporwave aesthetic', 'sunset sky',
    'lightning storm', 'rainbow colors', 'marble texture', 'lava flow'
];

/**
 * 3-way split: image (50%) | lottie (25%) | procedural (25%)
 */
export function getBackgroundType(concept) {
    const rand = Math.random() * 100;
    if (rand < 60) return 'image';
    if (rand < 80) return 'lottie';
    return 'procedural';
}

export async function getBackgroundImage(concept) {
    try {
        const randomSeed = Math.floor(Math.random() * 1000000);
        const url = `https://picsum.photos/seed/${randomSeed}/800/1200`;
        return { url, error: null };
    } catch (error) {
        return { url: null, error: `Error: ${error.message}` };
    }
}
