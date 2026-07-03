'use client';

import { motion } from 'framer-motion';

const ITEMS = [
  'LIVERY WRAP',
  '•',
  'APPAREL DESIGN',
  '•',
  'BRANDING',
  '•',
  'AEREM STUDIO',
  '•',
  'CREATIVE DIRECTION',
  '•',
  'VISUAL IDENTITY',
  '•',
  'STREETWEAR',
  '•',
  'RACE LIVERY',
  '•',
  'BRAND ACTIVATION',
  '•',
];

// Duplicate to simulate seamless loop
const TRACK = [...ITEMS, ...ITEMS, ...ITEMS];

export default function MarqueeSection() {
  return (
    <section className="w-full border-y border-border/10 overflow-hidden py-5 bg-background select-none">
      <div className="flex items-center">
        <motion.div
          className="flex items-center gap-0 whitespace-nowrap will-change-transform"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            duration: 22,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {TRACK.map((item, i) => (
            <span
              key={i}
              className={`inline-flex items-center px-5 ${
                item === '•'
                  ? 'text-accent text-lg leading-none'
                  : 'text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-semibold text-foreground/50 hover:text-foreground transition-colors duration-200'
              }`}
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
