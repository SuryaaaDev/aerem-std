import PortfolioGrid from '@/components/PortfolioGrid';
import type { Category } from '@/components/PortfolioGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ManifestoSection from '@/components/ManifestoSection';
import MarqueeSection from '@/components/MarqueeSection';
import ServicesSection from '@/components/ServicesSection';
import CapabilitiesSection from '@/components/CapabilitiesSection';
import { Project } from '@/types';
import { createClient } from '@/lib/supabase/server';

async function getProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching projects:', error.message);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Supabase error fetching categories:', error.message);
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Navigation ── */}
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero/Manifesto — oversized philosophy statement */}
        <div id="manifesto" className="pt-24">
          <ManifestoSection />
        </div>

        {/* 2. Infinite running marquee */}
        <MarqueeSection />

        {/* 3. Core Services — hover image preview micro-interaction */}
        <div id="services">
          <ServicesSection />
        </div>

        {/* 4. Capabilities — 3-step process grid */}
        <div id="process">
          <CapabilitiesSection />
        </div>

        {/* 5. Portfolio Grid — Selected Works */}
        <div id="work">
          <PortfolioGrid initialProjects={projects} initialCategories={categories} />
        </div>
      </main>

      {/* 6. Footer — contact + newsletter + giant wordmark */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}

