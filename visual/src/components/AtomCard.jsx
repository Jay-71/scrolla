import { useMemo } from 'react';
import { motion } from 'framer-motion';
import MesmerizeCanvas from './MesmerizeCanvas';
import BlobBackground from './BlobBackground';
import LottieBackground from './LottieBackground';
import ImageBackground from './ImageBackground';
import ProceduralBackground from './ProceduralBackground';
import { getBackgroundType } from '../utils/imageService';
import GenerativeArt from './GenerativeArt';
import ExplanationCard from './ExplanationCard';
import ExampleCard from './ExampleCard';
import QuestionCard from './QuestionCard';
import ComparisonCard from './ComparisonCard';
import { getConceptPalette, typeAccents } from '../utils/colors';

const typeComponents = {
    explanation: ExplanationCard,
    example: ExampleCard,
    question: QuestionCard,
    comparison: ComparisonCard,
};

const typeLabels = {
    explanation: '📖 Concept',
    example: '⚡ Example',
    question: '✦ Challenge',
    comparison: '⚖️ Compare',
};

function getDifficultyDots(difficulty) {
    const levels = { easy: 1, medium: 2, hard: 3 };
    const level = levels[difficulty] || 1;
    return Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={`difficulty-dot ${i < level ? 'filled' : ''}`} />
    ));
}

export default function AtomCard({ atom, isFirst, index, total }) {
    const TypeCard = typeComponents[atom.atom_type];
    const palette = getConceptPalette(atom.concept);
    const accent = typeAccents[atom.atom_type] || typeAccents.explanation;

    // Locked on mount — won't change across re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const bgType = useMemo(() => getBackgroundType(atom.concept), []);

    if (!TypeCard) return null;

    return (
        <div className="atom-card">
            {/* === Layer 1: Base gradient === */}
            <div
                className="gradient-bg"
                style={{
                    background: `radial-gradient(ellipse at 30% 20%, ${palette.bg2} 0%, ${palette.bg1} 60%, #060609 100%)`,
                }}
            />

            {/* === Layer 2: Morphing aurora blobs === */}
            <BlobBackground concept={atom.concept} />

            {/* === Layer 3: Dynamic Background (Image / Lottie / Procedural) === */}
            {bgType === 'image' && <ImageBackground concept={atom.concept} />}
            {bgType === 'lottie' && <LottieBackground concept={atom.concept} />}
            {bgType === 'procedural' && <ProceduralBackground />}

            {/* === Layer 4: Mesmerizing canvas patterns (always-on fallback + enhancement) === */}
            <MesmerizeCanvas concept={atom.concept} atomType={atom.atom_type} />

            {/* === Glassmorphism Card === */}
            <motion.div
                className="card-glass"
                initial={{ opacity: 0, y: 80, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                    '--accent-glow': accent.glow,
                    '--accent-color': accent.color,
                }}
            >
                {/* Card counter */}
                <motion.div
                    className="card-counter"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="counter-current" style={{ color: accent.color }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="counter-sep">/</span>
                    <span className="counter-total">{String(total).padStart(2, '0')}</span>
                </motion.div>

                {/* Type badge */}
                <motion.span
                    className="atom-type-badge"
                    style={{
                        background: `${accent.glow.replace('0.4', '0.12')}`,
                        color: accent.color,
                        borderColor: `${accent.glow.replace('0.4', '0.2')}`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    {typeLabels[atom.atom_type]}
                </motion.span>

                {/* Concept title */}
                <motion.h2
                    className="concept-title"
                    style={{
                        background: `linear-gradient(135deg, #fff 0%, ${accent.color} 120%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {atom.concept}
                </motion.h2>

                {/* Generative SVG art (infinite loops) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.7 }}
                >
                    <GenerativeArt concept={atom.concept} atomType={atom.atom_type} />
                </motion.div>

                {/* Type-specific interactive content */}
                <TypeCard atom={atom} accentColor={accent.color} />
            </motion.div>

            {/* Difficulty */}
            <div className="difficulty-indicator">
                {getDifficultyDots(atom.difficulty)}
                <span>{atom.difficulty}</span>
            </div>

            {/* Scroll hint */}
            {isFirst && (
                <div className="scroll-hint">
                    <span className="scroll-hint-text">scroll to explore</span>
                    <div className="scroll-hint-chevrons">
                        <span className="chevron" />
                        <span className="chevron" />
                        <span className="chevron" />
                    </div>
                </div>
            )}
        </div>
    );
}
