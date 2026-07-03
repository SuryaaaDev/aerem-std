'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const SERVICES = [
  {
    index: '01',
    title: 'Livery Design',
    subtitle: 'Vehicle Wraps & Racing Liveries',
    description:
      'Presisi tinggi pada setiap lekukan bodi. Dari mobil harian hingga race car, kami hadirkan livery yang tampil dominan di lintasan maupun jalan raya.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop',
    tags: ['Vinyl Wrap', 'Racing', 'Fleet'],
  },
  {
    index: '02',
    title: 'Streetwear & Apparel Graphics',
    subtitle: 'Desain Kaos & Koleksi Limited',
    description:
      'Grafis apparel yang dibuat untuk menjadi karya — bukan sekadar pakaian. Setiap rilis dirancang dengan narasi visual yang kuat dan edisi terbatas.',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=600&auto=format&fit=crop',
    tags: ['Screen Print', 'Embroidery', 'Drop'],
  },
  {
    index: '03',
    title: 'Visual Identity & Logo',
    subtitle: 'Brand System dari Nol',
    description:
      'Identitas visual yang bukan sekadar logo — melainkan sistem lengkap: warna, tipografi, motion guidelines, dan aset siap cetak maupun digital.',
    image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=600&auto=format&fit=crop',
    tags: ['Logo', 'Brand System', 'Guidelines'],
  },
  {
    index: '04',
    title: 'Brand Activation',
    subtitle: 'Experience & Campaign Collateral',
    description:
      'Dari booth pameran hingga aset kampanye digital — kami eksekusi aktivasi brand agar pesan Anda tersampaikan dengan impact maksimal.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop',
    tags: ['Campaign', 'Event', 'Digital'],
  },
];

export default function ServicesSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section className="w-full border-t border-border/10" onMouseMove={handleMouseMove}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="flex items-end justify-between mb-4 border-b border-border/10 pb-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-accent" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-foreground/40">
              Core Services
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-foreground/20">
            {String(SERVICES.length).padStart(2, '0')} Disciplines
          </span>
        </div>

        {/* Service rows */}
        <div className="flex flex-col">
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.index}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="group relative flex items-center justify-between py-7 border-b border-border/10 cursor-default gap-6 overflow-hidden"
            >
              {/* Hover bg sweep */}
              <motion.div
                className="absolute inset-0 bg-accent/5 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: hovered === i ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />

              {/* Left: index + title */}
              <div className="relative flex items-baseline gap-6 z-10 min-w-0">
                <span className="text-[9px] font-mono text-foreground/25 shrink-0">
                  {svc.index}
                </span>
                <div className="min-w-0">
                  <h3
                    className="font-black uppercase tracking-tighter leading-none transition-colors duration-200"
                    style={{
                      fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)',
                      color: hovered === i ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-foreground/30 mt-1">
                    {svc.subtitle}
                  </p>
                </div>
              </div>

              {/* Right: tags + arrow */}
              <div className="relative z-10 hidden md:flex items-center gap-4 shrink-0">
                <div className="flex gap-2">
                  {svc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] uppercase tracking-widest border border-border/30 px-2 py-1 text-foreground/40 group-hover:border-accent/40 group-hover:text-accent/60 transition-colors duration-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <motion.span
                  className="text-foreground/30 text-lg"
                  animate={{
                    x: hovered === i ? 6 : 0,
                    color: hovered === i ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                  }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating image cursor */}
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              className="fixed pointer-events-none z-50 rounded-none overflow-hidden border border-border/20"
              style={{
                width: 220,
                height: 160,
                top: mousePos.y - 80,
                left: mousePos.x + 24,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={SERVICES[hovered].image}
                alt={SERVICES[hovered].title}
                fill
                className="object-cover grayscale"
                sizes="220px"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-3 left-3">
                <p className="text-[9px] uppercase tracking-widest text-white/70">
                  {SERVICES[hovered].subtitle}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
