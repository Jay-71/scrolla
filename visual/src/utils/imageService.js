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
    if (rand < 50) return 'image';
    if (rand < 75) return 'lottie';
    return 'procedural';
}

/**
 * Fetches a UNIQUE image URL from Pixabay every time.
 * Returns { url: string|null, error: string|null }
 */
export async function getBackgroundImage(concept) {
    if (!PIXABAY_API_KEY) {
        return { url: null, error: 'Missing VITE_PIXABAY_API_KEY' };
    }

    try {
        const keyword = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
        const query = encodeURIComponent(keyword);
        const page = Math.floor(Math.random() * 50) + 1;

        const url = `${PIXABAY_URL}?key=${PIXABAY_API_KEY}&q=${query}&image_type=illustration&orientation=vertical&per_page=3&page=${page}&safesearch=true`;

        const response = await fetch(url);

        if (!response.ok) {
            const text = await response.text();
            return { url: null, error: `HTTP ${response.status}: ${text.slice(0, 100)}` };
        }

        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
            const hit = data.hits[Math.floor(Math.random() * data.hits.length)];
            return { url: hit.largeImageURL || hit.webformatURL, error: null };
        }

        return { url: null, error: 'No hits found' };

    } catch (error) {
        return { url: null, error: `Network: ${error.message}` };
    }
}
