import { motion } from 'framer-motion';

const lineVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/**
 * Highlight keywords — bold the first notable word in each line
 */
function highlightLine(text, accentColor) {
  // Find first word longer than 4 chars
  const words = text.split(' ');
  const idx = words.findIndex(w => w.replace(/[^a-zA-Z]/g, '').length > 4);
  if (idx === -1) return text;

  return (
    <>
      {words.slice(0, idx).join(' ')}{idx > 0 ? ' ' : ''}
      <span className="keyword-glow" style={{ color: accentColor }}>
        {words[idx]}
      </span>
      {' '}{words.slice(idx + 1).join(' ')}
    </>
  );
}

export default function ExplanationCard({ atom, accentColor }) {
  const lines = atom.content.split('\n').filter(Boolean);

  return (
    <div className="explanation-content">
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className="atom-text-line"
          custom={i}
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {highlightLine(line, accentColor)}
          {i === lines.length - 1 && <span className="typing-cursor">|</span>}
        </motion.p>
      ))}
    </div>
  );
}
