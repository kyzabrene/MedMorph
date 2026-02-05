
import React from 'react';

interface PenguinProps {
  state: 'idle' | 'thinking' | 'happy' | 'confused';
  size?: 'sm' | 'md' | 'lg';
}

const Penguin: React.FC<PenguinProps> = ({ state, size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-500 ${sizes[size]}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Simple SVG Penguin */}
        <circle cx="50" cy="60" r="35" fill="#1e293b" /> {/* Body */}
        <circle cx="50" cy="55" r="28" fill="white" />   {/* Belly */}
        <circle cx="50" cy="35" r="22" fill="#1e293b" /> {/* Head */}
        
        {/* Eyes */}
        <g className={state === 'thinking' ? 'animate-bounce' : ''}>
          <circle cx="42" cy="32" r="3" fill="white" />
          <circle cx="58" cy="32" r="3" fill="white" />
          <circle cx="42" cy="32" r="1.5" fill="black" />
          <circle cx="58" cy="32" r="1.5" fill="black" />
        </g>

        {/* Beak */}
        <path d="M45 40 L55 40 L50 48 Z" fill="#f59e0b" />

        {/* Thinking Bubbles */}
        {state === 'thinking' && (
          <g className="animate-pulse">
            <circle cx="75" cy="20" r="3" fill="#94a3b8" />
            <circle cx="85" cy="10" r="5" fill="#cbd5e1" />
          </g>
        )}
      </svg>
      {state === 'thinking' && (
        <p className="mt-2 text-sm font-medium text-slate-500 animate-pulse italic">
          Penguin is decoding...
        </p>
      )}
    </div>
  );
};

export default Penguin;
