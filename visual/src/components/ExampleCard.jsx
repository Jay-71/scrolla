import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';

const stepVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.9, filter: 'blur(4px)' },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 24,
        },
    },
};

export default function ExampleCard({ atom, accentColor }) {
    const steps = atom.content
        .split('\n')
        .filter(Boolean)
        .map((s) => s.replace(/^Step \d+:\s*/i, ''));

    const [revealedCount, setRevealedCount] = useState(1);
    const [confettiKey, setConfettiKey] = useState(0);
    const [ripple, setRipple] = useState(null);

    const handleTap = useCallback((e) => {
        if (revealedCount < steps.length) {
            // Ripple effect
            const rect = e.currentTarget.getBoundingClientRect();
            setRipple({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                key: Date.now(),
            });

            const next = revealedCount + 1;
            setRevealedCount(next);

            // Confetti on final step
            if (next === steps.length) {
                setConfettiKey((k) => k + 1);
            }
        }
    }, [revealedCount, steps.length]);

    const progress = revealedCount / steps.length;

    return (
        <>
            {/* Progress bar */}
            <div className="step-progress-track">
                <motion.div
                    className="step-progress-fill"
                    style={{ background: accentColor }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                />
            </div>

            <div
                className="steps-container"
                onClick={handleTap}
                style={{ position: 'relative' }}
            >
                {/* Ripple */}
                <AnimatePresence>
                    {ripple && (
                        <motion.div
                            key={ripple.key}
                            className="tap-ripple"
                            style={{ left: ripple.x, top: ripple.y, borderColor: accentColor }}
                            initial={{ scale: 0, opacity: 0.6 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            className={`step-item ${i < revealedCount ? 'revealed' : ''}`}
                            variants={stepVariants}
                            initial="hidden"
                            animate={i < revealedCount ? 'visible' : 'hidden'}
                            transition={{ delay: i === revealedCount - 1 ? 0 : 0 }}
                        >
                            <span
                                className="step-number"
                                style={i < revealedCount ? {
                                    background: `${accentColor}33`,
                                    color: accentColor,
                                    boxShadow: `0 0 12px ${accentColor}44`,
                                } : {}}
                            >
                                {i < revealedCount ? '✓' : i + 1}
                            </span>
                            <span className="step-text">{step}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Sparkle on final */}
                <Confetti trigger={confettiKey} />
            </div>

            {revealedCount < steps.length ? (
                <motion.p
                    className="tap-hint"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ↓ tap to reveal step {revealedCount + 1}
                </motion.p>
            ) : (
                <motion.p
                    className="tap-hint complete"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ color: accentColor }}
                >
                    ✦ All steps revealed!
                </motion.p>
            )}
        </>
    );
}
