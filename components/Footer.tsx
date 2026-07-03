import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-border/10 mt-4">

      {/* ── Stay In The Grid CTA ── */}
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 border-b border-border/10">
        <div>
          <h2
            className="font-black uppercase leading-[0.9] tracking-tighter mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Stay in<br />the Grid.
          </h2>
          <p className="text-foreground/50 text-xs leading-relaxed max-w-xs">
            Monthly briefing on design systems, precision brutalism, and
            studio updates — no spam, ever.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 max-w-sm">
          <label className="text-[9px] uppercase tracking-[0.2em] text-foreground/30">
            Email Address
          </label>
          <input
            type="email"
            placeholder="YOUR@EMAIL.COM"
            className="bg-transparent border-b border-border/20 py-2 focus:outline-none focus:border-accent text-xs uppercase tracking-widest text-foreground placeholder:text-foreground/20 transition-colors"
          />
          <button className="mt-2 bg-accent text-black font-bold py-3 px-6 text-[9px] uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors duration-200 w-max">
            Subscribe
          </button>
        </div>
      </div>

      {/* ── Giant wordmark ── */}
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-0 overflow-hidden">
        <p
          className="font-black uppercase tracking-tighter leading-none text-foreground select-none"
          style={{ fontSize: 'clamp(5rem, 20vw, 17rem)', letterSpacing: '-0.04em' }}
          aria-hidden="true"
        >
          AEREM
        </p>
      </div>

      {/* ── Footer meta strip ── */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/10">
        {/* Follow */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-1">Follow</span>
          {[
            { label: 'Instagram', href: 'https://instagram.com/aerem.std' },
            { label: 'TikTok', href: '#' },
            { label: 'Behance', href: '#' },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-foreground/60 uppercase tracking-widest hover:text-accent transition-colors"
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-1">Contact</span>
          <Link
            href="mailto:studio@aerem.design"
            className="text-[10px] text-foreground/60 hover:text-accent transition-colors"
          >
            studio@aerem.design
          </Link>
          <span className="text-[10px] text-foreground/40">+62 812-3456-7890</span>
          <span className="text-[10px] text-foreground/30 mt-1">
            Jakarta, Indonesia
          </span>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/30 mb-1">Legal</span>
          <Link href="#" className="text-[10px] text-foreground/60 uppercase tracking-widest hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="text-[10px] text-foreground/60 uppercase tracking-widest hover:text-accent transition-colors">
            Terms of Use
          </Link>
        </div>

        {/* Copyright */}
        <div className="flex items-end justify-start md:justify-end">
          <span className="text-[9px] text-foreground/20 uppercase tracking-widest text-left md:text-right leading-relaxed">
            © {year} Aerem Studio.<br />All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
