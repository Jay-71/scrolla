import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import AtomCard from './AtomCard';
import ProgressDots from './ProgressDots';

export default function TopicView() {
  const { filename } = useParams();
  const [topicData, setTopicData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/data/ML/${filename}.json`)
      .then(res => res.json())
      .then(data => {
        setTopicData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load topic:', err);
        setLoading(false);
      });
  }, [filename]);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (container && topicData) {
          const scrollTop = container.scrollTop;
          const cardHeight = container.clientHeight;
          const index = Math.round(scrollTop / cardHeight);
          setCurrentIndex(Math.min(index, topicData.atoms.length - 1));
        }
        ticking.current = false;
      });
    }
  }, [topicData]);

  const scrollToCard = useCallback((index) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: index * container.clientHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, topicData]);

  if (loading) {
    return (
      <div className="theme-luminous min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#1A1A2E] border-t-[#00d1ff] rounded-full" />
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="theme-luminous min-h-screen flex items-center justify-center text-white">
        Error loading topic.
      </div>
    );
  }

  return (
    <div className="theme-luminous min-h-screen w-full relative overflow-hidden font-sans">
      {/* Top Header */}
      <header className="absolute top-0 w-full z-50 backdrop-blur-md bg-[#0B0B1A]/40 border-b border-[#1A1A2E] py-4 px-6 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Link to="/roadmap" className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A1A2E] hover:bg-[#28283d] transition-colors border border-[#333348]">
            <ArrowLeft size={20} className="text-[#e2e0fc]" />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-semibold text-[#c6c4d8] uppercase tracking-wider">Machine Learning</h1>
            <h2 className="text-lg font-bold font-['Outfit'] text-white">{topicData.topic}</h2>
          </div>
          <div className="w-10 h-10" /> {/* Spacer for centering */}
        </div>
        
        {/* Neon Progress Bar */}
        <div className="w-full h-1 bg-[#1A1A2E] rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-gradient-to-r from-[#4e4feb] to-[#00d1ff] transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / topicData.atoms.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Swipeable Container */}
      <div className="scroll-container h-full" ref={containerRef}>
        {topicData.atoms.map((atom, i) => (
          <AtomCard
            key={i}
            atom={atom}
            isFirst={i === 0}
            index={i}
            total={topicData.atoms.length}
          />
        ))}
      </div>

      {/* Manual Navigation Overlays */}
      <div className="absolute right-6 bottom-12 flex flex-col gap-3 z-50">
        <button 
          onClick={() => scrollToCard(Math.max(0, currentIndex - 1))}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#1A1A2E]/80 backdrop-blur-md border border-[#333348] text-[#e2e0fc] hover:bg-[#28283d] hover:border-[#4e4feb] transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'shadow-[0_0_15px_rgba(78,79,235,0.2)]'}`}
          disabled={currentIndex === 0}
        >
          <ChevronUp size={24} />
        </button>
        <button 
          onClick={() => scrollToCard(Math.min(topicData.atoms.length - 1, currentIndex + 1))}
          className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-[#4e4feb] to-[#00d1ff] text-white hover:scale-110 transition-all shadow-[0_0_20px_rgba(0,209,255,0.4)] ${currentIndex === topicData.atoms.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentIndex === topicData.atoms.length - 1}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      <ProgressDots
        total={topicData.atoms.length}
        current={currentIndex}
        onDotClick={scrollToCard}
      />
    </div>
  );
}
