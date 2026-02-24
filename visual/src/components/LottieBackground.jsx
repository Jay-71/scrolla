import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { getBackgroundLottie } from '../utils/lottieRegistry';

/**
 * Lottie background animation — lazy-loads only when the card enters the viewport.
 * Uses IntersectionObserver to avoid fetching off-screen animations.
 * Includes zoom-to-blur reveal matching ImageBackground.
 */
export default function LottieBackground({ concept }) {
    const [animationData, setAnimationData] = useState(null);
    const [failed, setFailed] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef(null);

    // Only start loading when visible
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Fetch animation data only after becoming visible
    useEffect(() => {
        if (!isVisible) return;

        let cancelled = false;
        const url = getBackgroundLottie(concept);

        fetch(url, { mode: 'cors' })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (!cancelled) {
                    setAnimationData(data);
                    setFailed(false);
                }
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });

        return () => { cancelled = true; };
    }, [concept, isVisible]);

    return (
        <div ref={containerRef} className="lottie-bg-container">
            {animationData && !failed && (
                <motion.div
                    style={{ width: '100%', height: '100%' }}
                    initial={{ scale: 1.3, filter: 'blur(0px)' }}
                    whileInView={{ scale: 1, filter: 'blur(6px)' }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                        rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                    />
                </motion.div>
            )}
        </div>
    );
}
