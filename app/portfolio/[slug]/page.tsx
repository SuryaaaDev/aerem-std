import { notFound } from 'next/navigation';
import { Project } from '@/types';
import ProjectDetailView from '@/components/ProjectDetailView';

const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'NEUE FORM ARCHITECTS',
    slug: 'neue-form-architects',
    client: 'Neue Form',
    year: 2024,
    category: 'BRANDING',
    description: 'Structural identity systems for a Berlin-based architectural firm.',
    thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
    mockups: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'CYBER COUTURE',
    slug: 'cyber-couture',
    client: 'Cyber Couture',
    year: 2024,
    category: 'DESAIN KAOS',
    description: 'Immersive e-commerce experience for digital-first fashion label.',
    thumbnail: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop',
    mockups: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'TYPO MONO VOL 4',
    slug: 'typo-mono-vol-4',
    client: 'Typo Mono',
    year: 2024,
    category: 'DESAIN LOGO',
    description: 'Experimental type publication exploring monospaced aesthetics.',
    thumbnail: 'https://images.unsplash.com/photo-1621844234502-3c8230557cc3?q=80&w=800&auto=format&fit=crop',
    mockups: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'KINETIC FLUX',
    slug: 'kinetic-flux',
    client: 'Kinetic',
    year: 2024,
    category: 'LIVERY MOBIL',
    description: 'Dynamic brand identity for a generative tech company.',
    thumbnail: 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?q=80&w=800&auto=format&fit=crop',
    mockups: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'STILL FOUNDRY',
    slug: 'still-foundry',
    client: 'Still Foundry',
    year: 2023,
    category: 'BRANDING',
    description: 'Redefining visual heritage for a heritage industrial manufacturer.',
    thumbnail: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop',
    mockups: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'PORTAL OS',
    slug: 'portal-os',
    client: 'Portal',
    year: 2024,
    category: 'DESAIN LOGO',
    description: 'A brutalist approach to modern documentation and UI design.',
    thumbnail: 'https://images.unsplash.com/photo-1527685216219-c7104b281f62?q=80&w=800&auto=format&fit=crop',
    mockups: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function getProjects(): Promise<Project[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });

    if (!res.ok) {
      console.error('API responded with error, falling back to dummy data');
      return dummyProjects;
    }

    const data = await res.json();
    return data && data.length > 0 ? data : dummyProjects;
  } catch (error) {
    console.error('Fetch failed, falling back to dummy data', error);
    return dummyProjects;
  }
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug) || null;

  if (!project) {
    notFound();
  }

  // Calculate next project
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects.length > 1
    ? projects[(currentIndex + 1) % projects.length]
    : null;

  return (
    <ProjectDetailView project={project} nextProject={nextProject} />
  );
}

