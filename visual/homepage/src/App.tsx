import { motion, useScroll, useTransform } from 'framer-motion';
import { Network, Layers, ArrowRight, Activity, Terminal, Shield, Cpu, ChevronRight, Code, GitBranch, Box, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-panel-light py-4' : 'bg-transparent py-8'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-steel-100 border border-steel-200 flex items-center justify-center">
            <Layers size={16} className="text-steel-800" />
          </div>
          <span className="text-xl font-medium tracking-[0.2em] text-steel-900 uppercase">
            Scrolla
          </span>
        </div>
        <nav className="hidden md:flex gap-10">
          {['Platform', 'Intelligence', 'Architecture'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xs uppercase tracking-[0.15em] text-steel-600 hover:text-steel-900 transition-colors relative group font-medium"
            >
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-steel-700 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>
        <button className="hidden md:block px-6 py-2 border border-steel-300 rounded text-xs font-semibold uppercase tracking-[0.1em] text-steel-800 hover:border-steel-600 hover:text-steel-950 transition-all duration-300 bg-white/50">
          Initialize System
        </button>
      </div>
    </header>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-grid-pattern">
      <div className="glow-orb-1" />
      <div className="glow-orb-2" />

      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-12"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-steel-200/50 glass-panel-light mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-steel-800 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-steel-900"></span>
          </span>
          <span className="text-xs font-semibold tracking-[0.2em] text-steel-700 uppercase">
            System Online • Core v2.4
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full">
          {/* Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-8 leading-[0.9] text-steel-950"
            >
              Absolute <br />
              <span className="font-medium text-gradient">Precision.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-steel-600 max-w-xl mb-14 font-light leading-relaxed"
            >
              A minimalist engineering feed constructed on foundations of steel.
              Zero noise, zero clutter. Experience the raw data structure.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-6 relative z-20"
            >
              <button className="btn-premium px-10 py-5 text-steel-900 font-semibold uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-3 group shadow-xl">
                Commence Uplink
                <ArrowRight size={18} className="group-hover:translate-x-1 duration-300" />
              </button>
              <button className="px-10 py-5 border border-steel-300 text-steel-700 rounded-lg text-sm font-semibold uppercase tracking-[0.1em] hover:bg-steel-100 transition-colors duration-300">
                View Schematics
              </button>
            </motion.div>
          </div>

          {/* SVG Art Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden md:block w-80 h-80 lg:w-[500px] lg:h-[500px]"
          >
            <motion.img
              src="/hero-art.svg"
              alt="Monochrome geometric art"
              className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// Sub-component for visualizations inside Bento Cards
const CodeVisualization = () => (
  <div className="absolute top-6 right-6 bottom-6 w-1/2 glass-panel rounded-xl p-5 font-mono text-xs text-steel-600 hidden lg:block overflow-hidden abstract-shape-1 z-0 opacity-80">
    <div className="flex items-center gap-2 mb-4 border-b border-steel-200/50 pb-2">
      <div className="w-2 h-2 rounded-full bg-steel-400"></div>
      <div className="w-2 h-2 rounded-full bg-steel-400"></div>
      <div className="w-2 h-2 rounded-full bg-steel-400"></div>
      <span className="ml-2 text-steel-500">kernel.sys</span>
    </div>
    <div className="space-y-2">
      <p><span className="text-steel-400">01:</span> <span className="text-steel-800">import</span> &#123; core &#125; <span className="text-steel-800">from</span> '@scrolla/engine';</p>
      <p><span className="text-steel-400">02:</span> </p>
      <p><span className="text-steel-400">03:</span> <span className="text-steel-800">const</span> instance = <span className="text-steel-700">new</span> core.Analyzer(&#123;</p>
      <p><span className="text-steel-400">04:</span>   entropy: <span className="text-steel-600">0.0001</span>,</p>
      <p><span className="text-steel-400">05:</span>   mode: <span className="text-steel-700">'STEEL_THREAD'</span>,</p>
      <p><span className="text-steel-400">06:</span> &#125;);</p>
      <p><span className="text-steel-600">07:</span> </p>
      <p><span className="text-steel-600">08:</span> instance.execute();</p>
    </div>
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-steel-600 to-transparent"
    />
  </div>
);

const GraphVisualization = () => (
  <div className="mt-8 h-32 w-full flex items-end gap-2 p-4 abstract-shape-2 rounded-lg border border-steel-200">
    {[30, 50, 40, 70, 60, 90, 80, 100].map((height, i) => (
      <div key={i} className="flex-1 data-bar group" style={{ height: '100%' }}>
        <motion.div
          initial={{ height: "0%" }}
          whileInView={{ height: `${height}%` }}
          transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="data-bar-fill opacity-50 group-hover:opacity-100 transition-opacity"
        />
      </div>
    ))}
  </div>
);

const FeaturesBento = () => {
  return (
    <section className="py-32 relative z-20 bg-white border-t border-steel-200/50 bg-dots-pattern" id="intelligence">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-light text-steel-950 mb-6 tracking-tight">
            Forged in <span className="text-gradient">data.</span>
          </h2>
          <p className="text-lg md:text-xl text-steel-600 max-w-2xl font-light">
            Our architecture represents the pinnacle of knowledge extraction. Every component engineered for maximum efficiency.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">

          {/* Card 1: Large Span */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden bento-card cursor-pointer group"
          >
            <div className="relative z-10 w-full lg:w-1/2">
              <div className="w-12 h-12 rounded-lg bg-steel-100 border border-steel-200 flex items-center justify-center mb-6 text-steel-800">
                <Terminal size={24} />
              </div>
              <h3 className="text-3xl font-light text-steel-900 mb-4">Semantic Engine</h3>
              <p className="text-steel-600 font-light leading-relaxed mb-8">
                The core processor breaks down vast information matrices into logical, atomic data structures. No fluff, just the critical path to understanding.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-steel-700 font-medium group-hover:text-steel-950 transition-colors">
                Initialize Sequence <ChevronRight size={16} />
              </div>
            </div>
            <CodeVisualization />
          </motion.div>

          {/* Card 2: Square */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel rounded-2xl p-8 relative overflow-hidden bento-card flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-lg bg-steel-100 border border-steel-200 flex items-center justify-center mb-6 text-steel-800">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-light text-steel-900 mb-4">Impenetrable</h3>
              <p className="text-steel-600 font-light leading-relaxed">
                Fortified logic structures ensure knowledge retention bypasses shallow cognitive layers.
              </p>
            </div>
            <div className="mt-8 border-t border-steel-200 pt-6 flex justify-between items-center px-2">
              <span className="text-xs font-mono text-steel-500">STATUS.SEC</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
          </motion.div>

          {/* Card 3: Square */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel rounded-2xl p-8 relative overflow-hidden bento-card"
          >
            <div className="relative z-10 w-full">
              <div className="flex items-center gap-4 mb-8 text-steel-600">
                <Code size={20} />
                <GitBranch size={20} />
                <Box size={20} />
                <Settings size={20} />
              </div>
              <div className="w-12 h-12 rounded-lg bg-steel-100 border border-steel-200 flex items-center justify-center mb-6 text-steel-800 mt-4">
                <Network size={24} />
              </div>
              <h3 className="text-2xl font-light text-steel-900 mb-4">Neural Mesh</h3>
              <p className="text-steel-600 font-light leading-relaxed">
                Concepts interlink dynamically, constructing a robust lattice of understanding via git-ops protocols and modular frameworks.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Wide Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden bento-card"
          >
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Activity size={20} className="text-steel-700" />
                  <h3 className="text-2xl font-light text-steel-900">Telemetry</h3>
                </div>
                <p className="text-steel-600 font-light max-w-md">Real-time analysis of cognitive absorption rates across the network.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-steel-950 tracking-tighter">99.9%</div>
                <div className="text-xs font-mono text-steel-500 uppercase">Retention Index</div>
              </div>
            </div>
            <GraphVisualization />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

const Footer = () => (
  <footer className="border-t border-steel-200 py-16 px-6 md:px-12 relative z-20 bg-white">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-3">
        <Cpu size={20} className="text-steel-600" />
        <div className="text-sm font-semibold tracking-[0.2em] text-steel-800 uppercase">SCROLLA CORP</div>
      </div>
      <div className="flex gap-6 text-sm font-medium text-steel-500">
        <a href="#" className="hover:text-steel-800 transition-colors">Terminals</a>
        <a href="#" className="hover:text-steel-800 transition-colors">Protocols</a>
        <a href="#" className="hover:text-steel-800 transition-colors">Registry</a>
      </div>
      <div className="text-steel-400 text-xs font-mono">
        v2.4.9 // INITIALIZED
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <main className="min-h-screen text-steel-900 selection:bg-steel-200 selection:text-steel-950 relative">
      <Header />
      <Hero />
      <FeaturesBento />
      <Footer />
    </main>
  );
}

export default App;
