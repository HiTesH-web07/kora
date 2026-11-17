"use client";
import { motion } from "framer-motion";

export function Blossom({ className = "", color = "#E9A4AE", center = "#D5B77B" }: { className?: string; color?: string; center?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="50" cy="26" rx="15" ry="22" fill={color} transform={`rotate(${r} 50 50)`} opacity="0.92" />
      ))}
      <circle cx="50" cy="50" r="8" fill={center} />
    </svg>
  );
}

export function Heart({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M24 40C10 30 4 22 6 14c2-7 12-9 18-1 6-8 16-6 18 1 2 8-4 16-18 26z" />
    </svg>
  );
}

export function Squiggle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M4 14c10-12 18 10 30 0s20 10 32 0 20 10 32 0 20 10 32 0 14 4 26-2" />
    </svg>
  );
}

export function CurlArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 8c30-4 60 6 58 30-1 14-18 14-18 2 0-10 16-8 20 10M64 48l-4 12m4-12l12 4" />
    </svg>
  );
}

/** Slowly drifting decorative element. */
export function Float({ children, className = "", delay = 0, amp = 10, rotate = 6 }: { children: React.ReactNode; className?: string; delay?: number; amp?: number; rotate?: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      animate={{ y: [0, -amp, 0], rotate: [-rotate, rotate, -rotate] }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}
