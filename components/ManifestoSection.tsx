'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ManifestoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section
      ref={ref}
      className="relative w-full border-t border-border/10 overflow-hidden"
    >
      {/* Background year stamp */}
      <span
        className="absolute right-6 top-6 text-[9px] uppercase tracking-[0.3em] text-foreground/15 font-mono select-none"
        aria-hidden="true"
      >
        EST. 2020 — JAKARTA
      </span>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-36">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10">
          <span className="w-8 h-px bg-accent" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40">
            Our Manifesto
          </span>
        </div>

        {/* Oversized statement */}
        <h2 className="font-black uppercase leading-[0.88] tracking-tighter"
            style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}>
          {['WE SHAPE', 'VISUAL IDENTITIES', 'THAT DRIVE', 'CULTURE &', 'VELOCITY.'].map(
            (line, i) => (
              <motion.span
                key={i}
                className="block overflow-hidden"
                initial={false}
              >
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={inView ? { y: 0 } : { y: '105%' }}
                  transition={{
                    duration: 0.75,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Last word of last line in accent */}
                  {i === 4 ? (
                    <>CULTURE &amp; <span className="text-accent">VELOCITY.</span></>
                  ) : line}
                </motion.span>
              </motion.span>
            )
          )}
        </h2>

        {/* Sub-copy + stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col md:flex-row gap-12 md:gap-0 md:items-end md:justify-between"
        >
          <p className="text-foreground/50 text-sm leading-relaxed max-w-sm">
            Aerem Studio adalah studio desain berbasis Jakarta yang mengkhususkan diri
            pada identitas visual bold, livery kendaraan presisi, dan grafis apparel
            yang dirancang untuk melampaui tren.
          </p>

          <div className="flex gap-12">
            {[
              { value: '120+', label: 'Projects Delivered' },
              { value: '6 YRS', label: 'In Studio' },
              { value: '3', label: 'Industry Awards' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl md:text-4xl font-black tracking-tighter text-accent">
                  {stat.value}
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
