import { motion } from 'framer-motion';

/**
 * Minimal progress dots — lightweight, no heavy animations.
 */
export default function ProgressDots({ total, current, onDotClick }) {
    // Limit visible dots to avoid excessive DOM nodes
    const maxDots = Math.min(total, 20);
    const progress = total > 0 ? ((current + 1) / total) * 100 : 0;

    return (
        <div className="progress-container">
            {/* Mini progress bar */}
            <div className="mini-progress-track">
                <div
                    className="mini-progress-fill"
                    style={{ height: `${progress}%` }}
                />
            </div>

            {/* Dots */}
            <div className="progress-dots">
                {Array.from({ length: maxDots }, (_, i) => {
                    const actualIndex = Math.round((i / (maxDots - 1)) * (total - 1));
                    return (
                        <div
                            key={i}
                            className={`progress-dot ${actualIndex === current ? 'active' : ''}`}
                            onClick={() => onDotClick(actualIndex)}
                        />
                    );
                })}
            </div>

            {/* Label */}
            <span className="progress-label">
                {current + 1}/{total}
            </span>
        </div>
    );
}
