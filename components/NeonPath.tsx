import React from 'react';

interface NeonPathProps {
  className?: string;
  variant?: 'curve-left' | 'curve-right' | 'wave' | 'loop';
}

export function NeonPath({ className = '', variant = 'curve-left' }: NeonPathProps) {
  return (
    <div
      className={`pointer-events-none absolute select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#E879F9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22E5FF" stopOpacity="0.75" />
          </linearGradient>

          <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" result="blur1" />
            <feGaussianBlur stdDeviation="24" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {variant === 'curve-left' && (
          <path
            d="M-50,150 C250,50 400,450 750,300 C950,200 1050,450 1100,500"
            stroke="url(#neonGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonBlur)"
            opacity="0.65"
          />
        )}

        {variant === 'curve-right' && (
          <path
            d="M1050,100 C750,150 600,500 250,350 C50,250 -50,500 -100,550"
            stroke="url(#neonGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonBlur)"
            opacity="0.65"
          />
        )}

        {variant === 'wave' && (
          <path
            d="M-100,300 Q250,50 500,300 T1100,300"
            stroke="url(#neonGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#neonBlur)"
            opacity="0.55"
          />
        )}

        {variant === 'loop' && (
          <path
            d="M100,500 C150,200 450,100 600,300 C750,500 950,200 1050,150"
            stroke="url(#neonGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#neonBlur)"
            opacity="0.6"
          />
        )}
      </svg>
    </div>
  );
}
