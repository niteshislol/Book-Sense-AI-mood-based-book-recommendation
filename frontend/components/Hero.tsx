import React, { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import { CATEGORIES } from '../constants';

interface HeroProps {
  onSearch: (query: string) => void;
}

const PHRASES = [
  "Experience our AI-driven engine that understands your taste, mood, and context.",
  "Uncover hidden literary gems tailored specifically to your reading habits.",
  "Let your current emotion guide you to your next favorite story.",
  "Explore a universe of books curated by intelligent algorithms."
];

const MARQUEE_STYLES = `
  @keyframes marqueeLeftSafe {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-50%, 0, 0); }
  }
  @keyframes marqueeRightSafe {
    0% { transform: translate3d(-50%, 0, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
`;

// --- FIX: Component moved OUTSIDE of Hero ---
const MarqueeRow = memo(({ images, direction, speed }: { images: string[], direction: 'left' | 'right', speed: 'fast' | 'normal' | 'slow' }) => {
  const duration = speed === 'fast' ? '60s' : speed === 'slow' ? '140s' : '100s';

  // Optimization: 2 copies is usually enough if the list is long, 
  // but we'll stick to 2 to reduce DOM node count (was 4).
  const displayImages = [...images, ...images];

  const animationName = direction === 'left' ? 'marqueeLeftSafe' : 'marqueeRightSafe';

  return (
    <div className="flex relative overflow-hidden h-64 md:h-80 opacity-60 dark:opacity-60 grayscale-[10%] hover:grayscale-0 transition-all duration-700 pointer-events-none">
      <div
        className="flex absolute top-0" // removed will-change to let browser decide optimizations
        style={{
          width: 'max-content',
          animationName: animationName,
          animationDuration: duration,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {displayImages.map((src, i) => (
          <div key={`${src}-${i}`} className="flex-shrink-0 w-44 md:w-56 pr-4">
            <div className="w-full h-60 md:h-72 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 border border-black/5 dark:border-white/5 shadow-2xl">
              <img
                src={src}
                alt="Book Cover"
                className="w-full h-full object-cover" // Removed hover transform here to save performance during animation
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  // Typewriter state
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter Logic
  useEffect(() => {
    const currentPhrase = PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 30 : 50;
    const pauseTime = 2500;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (!isDeleting && displayText !== currentPhrase) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
      } else if (isDeleting && displayText !== '') {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
      } else if (!isDeleting && displayText === currentPhrase) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
      }
    }, typingSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayText, isDeleting, phraseIndex]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  }, [query, onSearch]);

  // Reduced array size slightly for better performance
  const row1 = useMemo(() => Array.from({ length: 20 }).map((_, i) => `https://covers.openlibrary.org/b/id/${10550000 + i * 5}-M.jpg`), []);
  const row2 = useMemo(() => Array.from({ length: 20 }).map((_, i) => `https://covers.openlibrary.org/b/id/${10550100 + i * 5}-M.jpg`), []);
  const row3 = useMemo(() => Array.from({ length: 20 }).map((_, i) => `https://covers.openlibrary.org/b/id/${10550200 + i * 5}-M.jpg`), []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-[#0b0e16] transition-colors duration-300">
      <style>{MARQUEE_STYLES}</style>

      {/* Dynamic Background Layer (Marquee) */}
      <div className="absolute inset-0 z-0 flex flex-col justify-center gap-6 transform -rotate-6 scale-110 pointer-events-none select-none">
        <MarqueeRow images={row1} direction="left" speed="normal" />
        <MarqueeRow images={row2} direction="right" speed="slow" />
        <MarqueeRow images={row3} direction="left" speed="fast" />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-50 via-slate-50/60 to-slate-50 dark:from-[#0b0e16] dark:via-[#0b0e16]/60 dark:to-[#0b0e16]"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-50/90 via-transparent to-slate-50/90 dark:from-[#0b0e16]/90 dark:via-transparent dark:to-[#0b0e16]/90"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl px-4 text-center mt-10">
        <h1 className="text-5xl md:text-7xl font-poppins font-extrabold mb-6 tracking-tight animate-fade-in drop-shadow-2xl">
          <span className="block text-gray-900 dark:text-white mb-2">Discover Your Next</span>
          <span className="text-gradient">Great Read</span>
        </h1>

        <div className="h-16 mb-10 max-w-2xl mx-auto flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-inter drop-shadow-sm">
            {displayText}
            <span className="animate-blink ml-1 text-[#6f57ff]">|</span>
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto opacity-0 animate-[fadeIn_0.8s_ease-out_0.6s_forwards]">
          <form onSubmit={handleSubmit} className="glass-panel p-2 rounded-full flex items-center transition-all focus-within:scale-[1.02] bg-white/70 dark:bg-[#0b0e16]/60 backdrop-blur-2xl">
            <div className="pl-6 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or vague idea..."
              className="w-full bg-transparent border-none text-gray-900 dark:text-white px-4 py-3 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 font-inter"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#6f57ff] to-[#5da6ff] text-white px-8 py-3 rounded-full font-semibold font-poppins hover:brightness-110 transition-all shadow-lg"
            >
              Smart Search
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3 opacity-0 animate-[fadeIn_0.8s_ease-out_0.9s_forwards]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSearch(cat)}
              className="px-5 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/40 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm hover:border-[#6f57ff]/50 hover:text-[#6f57ff] dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-[0_0_15px_rgba(111,87,255,0.3)] hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float opacity-50 z-20">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-white/20 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-gray-600 dark:bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;