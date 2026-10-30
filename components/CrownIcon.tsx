import React from 'react';

interface CrownIconProps {
  className?: string;
  size?: number;
}

export function CrownIcon({ className = 'w-5 h-5 text-[var(--gold)]', size = 20 }: CrownIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 18L4.5 7L9 11.5L12 4L15 11.5L19.5 7L21 18H3Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4.5" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="19.5" cy="6.5" r="1.5" fill="currentColor" />
      <path
        d="M5 20H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
