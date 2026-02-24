import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { getIconLottie, fallbackAnimation } from '../utils/lottieRegistry';

/**
 * Small continuously-looping animated Lottie icon for type badges.
 * Replaces static emojis with living, breathing icons.
 */
export default function AnimatedIcon({ concept, atomType, size = 22 }) {
    const [animationData, setAnimationData] = useState(null);

    useEffect(() => {
        let cancelled = false;
        const url = getIconLottie(concept, atomType);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error('Failed');
                return res.json();
            })
            .then((data) => {
                if (!cancelled) setAnimationData(data);
            })
            .catch(() => {
                // On failure, just don't render an icon
                if (!cancelled) setAnimationData(null);
            });

        return () => { cancelled = true; };
    }, [concept, atomType]);

    if (!animationData) {
        // Fallback: simple CSS-animated dot
        return (
            <span
                className="icon-fallback-dot"
                style={{
                    width: size * 0.5,
                    height: size * 0.5,
                }}
            />
        );
    }

    return (
        <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{
                width: size,
                height: size,
                display: 'inline-block',
                flexShrink: 0,
            }}
        />
    );
}
