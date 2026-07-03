import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyProjects = [
  {
    title: 'NEUE FORM ARCHITECTS',
    slug: 'neue-form-architects',
    client: 'Neue Form',
    year: 2024,
    category: 'BRANDING',
    description: 'Structural identity systems for a Berlin-based architectural firm.',
    thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop', // Branding stationary
    mockups: ['https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop']
  },
  {
    title: 'CYBER COUTURE',
    slug: 'cyber-couture',
    client: 'Cyber Couture',
    year: 2024,
    category: 'DESAIN KAOS',
    description: 'Immersive e-commerce experience for digital-first fashion label.',
    thumbnail: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=800&auto=format&fit=crop', // Black t-shirt / fashion
    mockups: ['https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&auto=format&fit=crop']
  },
  {
    title: 'TYPO MONO VOL 4',
    slug: 'typo-mono-vol-4',
    client: 'Typo Mono',
    year: 2024,
    category: 'DESAIN LOGO',
    description: 'Experimental type publication exploring monospaced aesthetics.',
    thumbnail: 'https://images.unsplash.com/photo-1621844234502-3c8230557cc3?q=80&w=800&auto=format&fit=crop', // Open book/magazine
    mockups: ['https://images.unsplash.com/photo-1621844234502-3c8230557cc3?q=80&w=1200&auto=format&fit=crop']
  },
  {
    title: 'KINETIC FLUX',
    slug: 'kinetic-flux',
    client: 'Kinetic',
    year: 2024,
    category: 'LIVERY MOBIL',
    description: 'Dynamic brand identity for a generative tech company.',
    thumbnail: 'https://images.unsplash.com/photo-1550853024-fae8cd4be47f?q=80&w=800&auto=format&fit=crop', // Abstract metallic
    mockups: ['https://images.unsplash.com/photo-1550853024-fae8cd4be47f?q=80&w=1200&auto=format&fit=crop']
  },
  {
    title: 'STILL FOUNDRY',
    slug: 'still-foundry',
    client: 'Still Foundry',
    year: 2023,
    category: 'BRANDING',
    description: 'Redefining visual heritage for a heritage industrial manufacturer.',
    thumbnail: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop', // Metallic logo embossed
    mockups: ['https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1200&auto=format&fit=crop']
  },
  {
    title: 'PORTAL OS',
    slug: 'portal-os',
    client: 'Portal',
    year: 2024,
    category: 'DESAIN LOGO',
    description: 'A brutalist approach to modern documentation and UI design.',
    thumbnail: 'https://images.unsplash.com/photo-1527685216219-c7104b281f62?q=80&w=800&auto=format&fit=crop', // Monitor setup
    mockups: ['https://images.unsplash.com/photo-1527685216219-c7104b281f62?q=80&w=1200&auto=format&fit=crop']
  }
];

async function seed() {
  console.log('Clearing existing projects...');
  const { error: delError } = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (delError) console.error("Error deleting:", delError);

  console.log('Inserting dummy projects...');
  const { error: insError } = await supabase.from('projects').insert(dummyProjects);
  if (insError) {
    console.error("Error inserting:", insError);
  } else {
    console.log("Successfully seeded projects!");
  }
}

seed();
