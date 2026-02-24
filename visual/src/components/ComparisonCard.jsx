import { motion } from 'framer-motion';

const panelVariants = {
    hidden: (dir) => ({
        opacity: 0,
        x: dir === 'left' ? -60 : 60,
        scale: 0.9,
        filter: 'blur(6px)',
    }),
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            type: 'spring',
            stiffness: 200,
            damping: 22,
        },
    },
};

const pointVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: 0.4 + i * 0.12,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

export default function ComparisonCard({ atom, accentColor }) {
    const data =
        typeof atom.content === 'string' ? JSON.parse(atom.content) : atom.content;

    return (
        <div className="comparison-wrapper">
            <div className="comparison-container">
                {/* Left panel */}
                <motion.div
                    className="comparison-panel left-panel"
                    custom="left"
                    variants={panelVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="panel-title">{data.left.title}</div>
                    {data.left.points.map((point, i) => (
                        <motion.div
                            key={i}
                            className="panel-point"
                            custom={i}
                            variants={pointVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.span
                                className="point-flash"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: [0, 0.6, 0] }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                            />
                            {point}
                        </motion.div>
                    ))}
                </motion.div>

                {/* VS Divider */}
                <motion.div
                    className="vs-divider"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
                >
                    <motion.span
                        className="vs-text"
                        style={{
                            color: accentColor,
                            textShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}66`,
                        }}
                        animate={{
                            textShadow: [
                                `0 0 20px ${accentColor}, 0 0 40px ${accentColor}66`,
                                `0 0 30px ${accentColor}, 0 0 60px ${accentColor}88`,
                                `0 0 20px ${accentColor}, 0 0 40px ${accentColor}66`,
                            ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        VS
                    </motion.span>
                    <motion.div
                        className="vs-line"
                        style={{ background: `linear-gradient(to bottom, transparent, ${accentColor}44, transparent)` }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    />
                </motion.div>

                {/* Right panel */}
                <motion.div
                    className="comparison-panel right-panel"
                    custom="right"
                    variants={panelVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <div className="panel-title">{data.right.title}</div>
                    {data.right.points.map((point, i) => (
                        <motion.div
                            key={i}
                            className="panel-point"
                            custom={i}
                            variants={pointVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <motion.span
                                className="point-flash"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: [0, 0.6, 0] }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                            />
                            {point}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
