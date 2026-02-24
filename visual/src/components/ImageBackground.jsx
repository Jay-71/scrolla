import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getBackgroundImage } from '../utils/imageService';

export default function ImageBackground({ concept }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchImage() {
            setLoading(true);
            const result = await getBackgroundImage(concept);

            if (mounted) {
                if (result.url) {
                    setImageUrl(result.url);
                }
                setLoading(false);
            }
        }

        fetchImage();
        return () => { mounted = false; };
    }, [concept]);

    if (!imageUrl || loading) return null;

    return (
        <motion.div
            className="image-bg-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image: zoomed-in + sharp → original size → blurred */}
            <motion.img
                src={imageUrl}
                alt=""
                className="image-bg-img"
                initial={{ scale: 1.35, filter: 'blur(0px) saturate(1.5) brightness(1.1)' }}
                whileInView={{ scale: 1, filter: 'blur(6px) saturate(1.2) brightness(0.9)' }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="image-bg-overlay" />
        </motion.div>
    );
}
