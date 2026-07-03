'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';
import Image from 'next/image';

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export default function PortfolioGrid({
  initialProjects,
  initialCategories = [],
}: {
  initialProjects: Project[];
  initialCategories?: Category[];
}) {
  const [filter, setFilter] = useState('ALL');

  const filteredProjects = initialProjects.filter(
    (project) => filter === 'ALL' || project.category.toUpperCase() === filter.toUpperCase()
  );

  return (
    <div className="w-full">
      {/* ── Hero Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <h1
          className="font-bold uppercase leading-[0.88] tracking-tighter mb-6"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)' }}
        >
          Selected<br />Works
        </h1>
        <p className="text-foreground/50 max-w-sm text-xs leading-relaxed tracking-wide">
          A curated archive of visual identities, technical liveries, and apparel
          systems crafted for the precision-obsessed.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="border-y border-border/20 relative bg-background">
        {/* Left fade indicator (only visible on mobile/overflow) */}
        <div className="absolute left-0 top-px bottom-px w-10 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 md:hidden" />
        
        {/* Right fade indicator (only visible on mobile/overflow) */}
        <div className="absolute right-0 top-px bottom-px w-10 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 md:hidden" />

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth relative z-0">
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 shrink-0 pr-2 font-mono select-none">
            Filter by:
          </span>
          {/* "All" tab */}
          {[{ id: 'all', name: 'ALL' }, ...initialCategories.map((c) => ({ id: c.id, name: c.name }))].map((cat) => {
            const active = filter === cat.name;
            return (
              <button
                key={cat.id}
                onClick={(e) => {
                  setFilter(cat.name);
                  // Smoothly center the clicked filter button on mobile devices
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                  });
                }}
                className={`relative shrink-0 px-4 py-2 text-[9px] uppercase tracking-[0.15em] font-semibold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-accent text-black font-black'
                    : 'bg-transparent text-foreground/45 border border-border/20 hover:border-foreground/30 hover:text-foreground'
                }`}
                style={{ minHeight: '32px' }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>


      {/* ── Project Grid ── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                key={project.id}
                className="group flex flex-col"
              >
                <Link href={`/portfolio/${project.slug}`} className="flex flex-col gap-3">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-border/10">
                    {project.thumbnail ? (
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover grayscale-[20%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-foreground/10 text-xs uppercase tracking-widest">
                        No Image
                      </div>
                    )}

                    {/* Category badge — overlaid bottom-left, neon lime */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="bg-accent text-black text-[8px] uppercase tracking-[0.18em] font-bold px-2 py-1">
                        {project.category}
                      </span>
                    </div>

                    {/* Hover vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Meta row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-sm font-bold uppercase tracking-wider leading-tight group-hover:text-accent transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-foreground/40 leading-relaxed line-clamp-2 max-w-xs">
                        {project.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-foreground/30 shrink-0 mt-0.5 font-mono">
                      {project.year}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-32 text-foreground/20 text-xs uppercase tracking-[0.3em]">
            No projects in this category.
          </div>
        )}
      </div>
    </div>
  );
}
