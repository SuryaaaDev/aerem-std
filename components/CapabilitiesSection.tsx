'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const STEPS = [
  {
    num: '01',
    phase: 'Research & Briefing',
    body: 'Kami mulai dari pemahaman mendalam tentang brand Anda — siapa audiens, di mana mereka berada, dan apa yang ingin dikomunikasikan. Brief yang tajam menghasilkan desain yang tepat sasaran.',
    accent: 'Discovery',
  },
  {
    num: '02',
    phase: 'Design Concept',
    body: 'Referensi visual dikompilasi, mood dikalibrasi, kemudian kami mengeksekusi konsep dalam beberapa arah desain. Setiap iterasi dibahas terbuka bersama klien.',
    accent: 'Craft',
  },
  {
    num: '03',
    phase: 'Mockup Validation',
    body: 'Desain diuji pada objek nyata — mobil, kain, layar digital. Presentasi mockup photorealistic memastikan hasil akhir sesuai ekspektasi sebelum masuk produksi.',
    accent: 'Reality Check',
  },
];

export default function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section className="w-full border-t border-border/10" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="w-8 h-px bg-accent" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40">
            Our Approach
          </span>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-border/10">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.65,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col gap-6 px-0 md:px-10 py-8 first:pl-0 last:pr-0 border-t md:border-t-0 border-border/10 first:border-t-0"
            >
              {/* Step number */}
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-foreground/25">{step.num}</span>
                <span className="inline-block bg-accent text-black text-[8px] uppercase tracking-[0.18em] font-bold px-2 py-0.5">
                  {step.accent}
                </span>
              </div>

              {/* Phase title */}
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight">
                {step.phase}
              </h3>

              {/* Body */}
              <p className="text-sm text-foreground/50 leading-relaxed">{step.body}</p>

              {/* Decorative line */}
              <motion.div
                className="h-px bg-accent/40 origin-left"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: i * 0.12 + 0.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-t border-border/10 pt-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-sm text-foreground/40 max-w-sm">
            Siap memulai project? Konsultasi awal gratis — kami siap mendengar.
          </p>
          <a
            href="mailto:studio@aerem.design"
            className="group flex items-center gap-3 border border-foreground/20 px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
          >
            Start a Project
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
