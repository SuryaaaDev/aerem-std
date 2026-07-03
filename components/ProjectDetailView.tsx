'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/types';
import Navbar from './Navbar';
import Footer from './Footer';

interface ProjectDetailViewProps {
  project: Project;
  nextProject: Project | null;
  hideNavbar?: boolean;
}

// Fallback high-fidelity visuals for seeded projects
const PROJECT_VISUALS: Record<string, {
  hero: string;
  statement: string;
  tags: string[];
  mockups: string[];
  execution: string[];
  codename: string;
}> = {
  'neue-form-architects': {
    hero: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    statement: 'STRUCTURAL IDENTITY SYSTEMS FOR MODERN SPACE.',
    tags: ['#BRUTALISM', '#GRID-SYSTEM', '#STRETCH-TYPE'],
    mockups: [
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1503387762-592ded58c454?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512403754473-2785561399cf?q=80&w=800&auto=format&fit=crop',
    ],
    codename: 'N.FORM // 01'
  },
  'cyber-couture': {
    hero: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
    statement: 'DIGITAL-FIRST STREETWEAR SYSTEMS FOR THE METAVERSE.',
    tags: ['#TECHWEAR', '#GENERATIVE-GARMENTS', '#CYBERPUNK'],
    mockups: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    ],
    codename: 'C.COUTURE // 02'
  },
  'typo-mono-vol-4': {
    hero: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=1600&auto=format&fit=crop',
    statement: 'EXPLORING THE BOUNDARIES OF MONOSPACED TYPE.',
    tags: ['#EDITORIAL', '#MONOSPACED', '#INDEPENDENT-PRESS'],
    mockups: [
      'https://images.unsplash.com/photo-1621844234502-3c8230557cc3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568219656418-15c329312bf1?q=80&w=800&auto=format&fit=crop',
    ],
    codename: 'T.MONO // 03'
  },
  'kinetic-flux': {
    hero: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop',
    statement: 'A NEW VISUAL STANDARD FOR HIGH-SPEED SYSTEMS.',
    tags: ['#MOTORSPORT', '#LIVERY-DESIGN', '#BRAND-IDENTITY'],
    mockups: [
      'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600706432502-75a0e286b92b?q=80&w=800&auto=format&fit=crop',
    ],
    codename: 'K.FLUX // 04'
  },
  'still-foundry': {
    hero: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1600&auto=format&fit=crop',
    statement: 'REDEFINING VISUAL HERITAGE IN HEAVY INDUSTRIAL.',
    tags: ['#METAL-LOGOMARK', '#HERITAGE-SYSTEM', '#INDUSTRIAL'],
    mockups: [
      'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
    ],
    codename: 'S.FOUNDRY // 05'
  },
  'portal-os': {
    hero: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1600&auto=format&fit=crop',
    statement: 'A BRUTALIST APPROACH TO MODERN INTERACTION.',
    tags: ['#OS-INTERFACE', '#CODE-GRID', '#TERMINAL-BRAND'],
    mockups: [
      'https://images.unsplash.com/photo-1527685216219-c7104b281f62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=800&auto=format&fit=crop',
    ],
    codename: 'P.OS // 06'
  }
};

export default function ProjectDetailView({ project, nextProject, hideNavbar = false }: ProjectDetailViewProps) {
  // Retrieve customized visuals or use defaults
  const custom = PROJECT_VISUALS[project.slug] || {
    hero: project.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    statement: `A PRECISE AND BOLD TAKE ON ${project.category}.`,
    tags: [`#${project.category.replace(/\s+/g, '-')}`, '#MINIMALIST', '#AEREM-STANDARD'],
    mockups: project.mockups.length > 0 ? project.mockups : [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    ],
    execution: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    ],
    codename: `${project.title.substring(0, 3).toUpperCase()} // ${project.year || '26'}`
  };

  // Split title to highlite last word in neon
  const words = project.title.split(' ');
  const lastWord = words.pop() || '';
  const remainingTitle = words.join(' ');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {!hideNavbar && <Navbar />}

      <main className={`flex-grow ${hideNavbar ? 'pt-0' : 'pt-20'}`}>

        {/* ── 1. HERO SECTION ── */}
        <section className="relative w-full h-[85vh] flex items-end overflow-hidden border-b border-border/10">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={custom.hero}
              alt={project.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/35 z-0" />
          </div>

          {/* Project Details Overlay */}
          <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-16">
            <div className="flex flex-col items-start gap-4">
              <span className="border border-accent/40 text-accent bg-accent/5 px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-mono">
                Project Review
              </span>

              <h1
                className="font-black uppercase leading-[0.9] tracking-tighter text-white"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 6.5rem)' }}
              >
                {remainingTitle}{' '}
                <span className="text-accent">{lastWord}</span>
              </h1>

              {project.description && (
                <p className="max-w-2xl text-sm md:text-base text-foreground/75 leading-relaxed font-medium mt-2">
                  {project.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── 2. METADATA SECTION ── */}
        <section className="border-b border-border/10 bg-background py-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-border/10">
            <div className="flex flex-col md:px-6 first:pl-0">
              <span className="text-[9px] uppercase tracking-[0.25em] text-foreground/30 mb-2 font-mono">Client</span>
              <span className="font-extrabold text-sm tracking-wider uppercase text-foreground">{project.client || 'N/A'}</span>
            </div>
            <div className="flex flex-col md:px-8">
              <span className="text-[9px] uppercase tracking-[0.25em] text-foreground/30 mb-2 font-mono">Release Year</span>
              <span className="font-extrabold text-sm tracking-wider uppercase text-foreground">{project.year || 'N/A'}</span>
            </div>
            <div className="flex flex-col md:px-8 last:pr-0">
              <span className="text-[9px] uppercase tracking-[0.25em] text-foreground/30 mb-2 font-mono">Deliverables</span>
              <span className="font-extrabold text-sm tracking-wider uppercase text-foreground">{project.category || 'N/A'}</span>
            </div>
          </div>
        </section>

        {/* ── 3. OVERVIEW / INTRODUCTION ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left Big Heading */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none text-foreground/90">
                {custom.statement}
              </h2>
            </div>

            {/* Right Challenge Detail */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-8">
              <p className="text-sm md:text-base text-foreground/60 leading-relaxed max-w-xl">
                Tantangan utama dari project ini adalah menerjemahkan nilai inti brand ke dalam bahasa visual yang lugas, radikal, dan berkarakter kuat. Kami mereduksi elemen dekoratif non-esensial dan memprioritaskan kekuatan layout grid, kontras ekstrem, dan presisi tipografi untuk menghasilkan impresi visual yang membekas.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {custom.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border/20 text-foreground/50 hover:border-accent hover:text-accent font-mono text-[9px] uppercase tracking-widest px-3 py-1 transition-colors duration-200 cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. MOCKUP APPLICATION GRID ── */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/10 pb-5 mb-10">
            <h2 className="text-base font-black uppercase tracking-widest text-foreground/90">
              Mockup Application
            </h2>
            <span className="text-[9px] font-mono tracking-[0.2em] text-accent uppercase">
              MOCKUP_ASSET_PROJECT_01 // L2
            </span>
          </div>

          {/* Asymmetric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Image 1: Large (2/3 width) */}
            <div className="relative md:col-span-8 aspect-[16/10] md:h-[480px] border border-border/10 overflow-hidden group bg-border/5">
              {custom.mockups[0] && (
                <Image
                  src={custom.mockups[0]}
                  alt={`${project.title} mockup 1`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}
            </div>

            {/* Image 2: Tall (1/3 width) */}
            <div className="relative md:col-span-4 aspect-[3/4] md:h-[480px] border border-border/10 overflow-hidden group bg-border/5">
              {custom.mockups[1] && (
                <Image
                  src={custom.mockups[1]}
                  alt={`${project.title} mockup 2`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              )}
            </div>

            {/* Image 3: Tall (1/3 width) */}
            <div className="relative md:col-span-4 aspect-[3/4] md:h-[480px] border border-border/10 overflow-hidden group bg-border/5">
              {custom.mockups[2] && (
                <Image
                  src={custom.mockups[2]}
                  alt={`${project.title} mockup 3`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              )}
            </div>

            {/* Image 4: Large (2/3 width) */}
            <div className="relative md:col-span-8 aspect-[16/10] md:h-[480px] border border-border/10 overflow-hidden group bg-border/5">
              {custom.mockups[3] && (
                <Image
                  src={custom.mockups[3]}
                  alt={`${project.title} mockup 4`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              )}
            </div>
          </div>
        </section>


        {/* ── 6. NEXT PROJECT CTA ── */}
        {nextProject && (
          <section className="w-full border-t border-border/10 py-24 bg-background group">
            <div className="max-w-7xl mx-auto px-6">
              <Link href={`/portfolio/${nextProject.slug}`} className="block">
                <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/30 font-mono block mb-4">
                  Up Next
                </span>
                <div className="flex items-center justify-between gap-8">
                  <h3 className="font-black uppercase tracking-tighter leading-none text-foreground/70 group-hover:text-accent transition-colors duration-300"
                      style={{ fontSize: 'clamp(2rem, 7vw, 5.5rem)' }}>
                    {nextProject.title}
                  </h3>
                  <motion.div
                    className="text-foreground/40 group-hover:text-accent transition-colors duration-300"
                    whileHover={{ x: 12 }}
                  >
                    <ArrowRight size={48} className="w-12 h-12 md:w-16 md:h-16 stroke-[1.5]" />
                  </motion.div>
                </div>
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
