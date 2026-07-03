'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Work', href: '/' },
  { label: 'Studio', href: '#' },
  { label: 'Contact', href: '#' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border/10 bg-background/60 backdrop-blur-md backdrop-saturate-150 supports-[backdrop-filter]:bg-background/40">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="relative z-[60] text-sm sm:text-base font-extrabold tracking-widest uppercase text-foreground hover:text-accent transition-colors duration-200"
          style={{ letterSpacing: '0.12em' }}
        >
          Aerem Studio
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/admin"
            className="text-[9px] font-bold uppercase tracking-[0.2em] border border-foreground/30 px-3 py-1.5 text-foreground/60 hover:border-accent hover:text-accent transition-all duration-200"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="relative z-[60] md:hidden p-2 -mr-2 border border-border/20 text-foreground/70 hover:text-accent hover:border-accent/40 transition-all duration-200 cursor-pointer"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        />

        <div
          className={`relative h-full pt-[60px] overflow-y-auto bg-background/85 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/70 transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-y-0' : '-translate-y-3'
          }`}
        >
          <div className="px-4 sm:px-6 py-8 flex flex-col gap-1 min-h-full">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="group flex items-center justify-between py-4 border-b border-border/10 text-sm font-bold uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors duration-200"
              >
                {item.label}
                <span className="text-[9px] font-mono text-foreground/25 group-hover:text-accent transition-colors">
                  →
                </span>
              </Link>
            ))}

            <Link
              href="/admin"
              onClick={closeMenu}
              className="mt-4 flex items-center justify-center py-3 border border-foreground/25 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 hover:border-accent hover:text-accent hover:bg-accent/5 transition-all duration-200"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
