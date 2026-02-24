import { useState, useRef, useCallback, useEffect } from 'react';
import AtomCard from './components/AtomCard';
import ProgressDots from './components/ProgressDots';
import atoms from './data/atoms.json';
import './App.css';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(() => {
        const container = containerRef.current;
        if (container) {
          const scrollTop = container.scrollTop;
          const cardHeight = container.clientHeight;
          const index = Math.round(scrollTop / cardHeight);
          setCurrentIndex(Math.min(index, atoms.length - 1));
        }
        ticking.current = false;
      });
    }
  }, []);

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
  }, [handleScroll]);

  return (
    <>
      <div className="scroll-container" ref={containerRef}>
        {atoms.map((atom, i) => (
          <AtomCard
            key={atom.id}
            atom={atom}
            isFirst={i === 0}
            index={i}
            total={atoms.length}
          />
        ))}
      </div>
      <ProgressDots
        total={atoms.length}
        current={currentIndex}
        onDotClick={scrollToCard}
      />
    </>
  );
}
