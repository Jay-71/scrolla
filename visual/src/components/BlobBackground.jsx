import { getConceptPalette } from '../utils/colors';

/**
 * Lightweight blob background using pure CSS animations instead of Framer Motion.
 * CSS animations are GPU-composited and much cheaper than JS-driven motion.
 */
export default function BlobBackground({ concept }) {
    const palette = getConceptPalette(concept);

    const blobs = [
        { color: palette.glow1, size: 340, x: '20%', y: '15%', duration: '12s', dx: 40, dy: 30 },
        { color: palette.glow2, size: 280, x: '70%', y: '60%', duration: '15s', dx: -35, dy: 50 },
        {
            color: palette.primary.replace(')', ', 0.15)').replace('hsl(', 'hsla('),
            size: 220, x: '45%', y: '80%', duration: '18s', dx: 50, dy: -40,
        },
    ];

    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            overflow: 'hidden', pointerEvents: 'none',
        }}>
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    className="blob-orb"
                    style={{
                        position: 'absolute',
                        left: blob.x,
                        top: blob.y,
                        width: blob.size,
                        height: blob.size,
                        borderRadius: '50%',
                        background: blob.color,
                        filter: 'blur(80px)',
                        transform: 'translate(-50%, -50%)',
                        animation: `blobFloat${i} ${blob.duration} ease-in-out infinite`,
                        willChange: 'transform',
                    }}
                />
            ))}

            {/* CSS keyframes injected via style tag */}
            <style>{`
                @keyframes blobFloat0 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    33% { transform: translate(calc(-50% + 40px), calc(-50% - 30px)) scale(1.15); }
                    66% { transform: translate(calc(-50% - 28px), calc(-50% + 18px)) scale(0.9); }
                }
                @keyframes blobFloat1 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    33% { transform: translate(calc(-50% - 35px), calc(-50% + 50px)) scale(1.1); }
                    66% { transform: translate(calc(-50% + 25px), calc(-50% - 30px)) scale(0.92); }
                }
                @keyframes blobFloat2 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    33% { transform: translate(calc(-50% + 50px), calc(-50% - 40px)) scale(1.12); }
                    66% { transform: translate(calc(-50% - 35px), calc(-50% + 24px)) scale(0.88); }
                }
            `}</style>
        </div>
    );
}
