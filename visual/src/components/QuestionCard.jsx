import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';

export default function QuestionCard({ atom, accentColor }) {
    const [revealed, setRevealed] = useState(false);
    const [confettiKey, setConfettiKey] = useState(0);

    const handleReveal = () => {
        setRevealed(true);
        setConfettiKey((k) => k + 1);
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Question */}
            <motion.p
                className="question-text"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {atom.content}
            </motion.p>

            <AnimatePresence mode="wait">
                {!revealed ? (
                    <motion.button
                        key="btn"
                        className="reveal-btn"
                        onClick={handleReveal}
                        style={{
                            borderColor: `${accentColor}55`,
                            color: accentColor,
                            background: `${accentColor}15`,
                        }}
                        whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${accentColor}30` }}
                        whileTap={{ scale: 0.96 }}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
                        transition={{ duration: 0.35 }}
                    >
                        {/* Pulsing glow ring */}
                        <motion.span
                            className="btn-glow-ring"
                            style={{ borderColor: accentColor }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.4, 0, 0.4],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span>✦ Tap to reveal answer</span>
                    </motion.button>
                ) : (
                    <motion.div
                        key="answer"
                        className="answer-box"
                        style={{
                            borderColor: `${accentColor}25`,
                            background: `${accentColor}0a`,
                        }}
                        initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)', y: 20 }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
                        transition={{
                            duration: 0.7,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        {/* Shimmer sweep */}
                        <motion.div
                            className="shimmer-sweep"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 1.2, delay: 0.5 }}
                        />
                        <p className="answer-text">{atom.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Confetti trigger={confettiKey} />
        </div>
    );
}
