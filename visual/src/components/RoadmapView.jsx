import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoadmapView() {
  const [indexData, setIndexData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/ML/index.json')
      .then(res => res.json())
      .then(data => {
        setIndexData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load roadmap index:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="theme-luminous min-h-screen w-full font-sans relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#4e4feb] rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00d1ff] rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0B1A]/60 border-b border-[#1A1A2E] py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A1A2E] hover:bg-[#28283d] transition-colors border border-[#333348]">
            <ArrowLeft size={20} className="text-[#e2e0fc]" />
          </Link>
          <h1 className="text-2xl font-bold font-['Outfit'] text-white tracking-tight">Machine Learning</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-[#c6c4d8]">
          <Activity size={16} className="text-[#00d1ff]" />
          <span>{indexData.length} Topics Available</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-['Outfit'] text-white mb-4">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4e4feb] to-[#00d1ff]">Algorithm.</span>
          </h2>
          <p className="text-lg text-[#c6c4d8] max-w-2xl font-light">
            Enter the flow state. Progress through curated, high-density learning atoms designed for maximum cognitive retention.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-[#1A1A2E] border-t-[#00d1ff] rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indexData.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link to={`/topic/${topic.filename.replace('.json', '')}`} className="block h-full">
                  <div className="h-full p-6 rounded-2xl bg-[#1A1A2E]/80 backdrop-blur-xl border border-[#333348] hover:border-[#00d1ff]/50 hover:bg-[#1e1e32] transition-all duration-300 group shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#0B0B1A] border border-[#28283d] flex items-center justify-center text-[#c0c1ff] font-['Outfit'] font-bold">
                        {topic.id.split('_')[0]}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[#0B0B1A] border border-[#333348] text-xs font-semibold text-[#a6e6ff] flex items-center gap-1.5">
                        <BookOpen size={12} />
                        {topic.atom_count} Atoms
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold font-['Outfit'] text-[#e2e0fc] mb-3 group-hover:text-white transition-colors line-clamp-2">
                      {topic.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 flex items-center gap-4 text-sm text-[#908fa1]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        <span>~{Math.ceil(topic.atom_count * 1.5)} min</span>
                      </div>
                      <div className="h-1 flex-1 bg-[#0B0B1A] rounded-full overflow-hidden">
                        <div className="h-full w-0 group-hover:w-[15%] bg-gradient-to-r from-[#4e4feb] to-[#00d1ff] transition-all duration-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
