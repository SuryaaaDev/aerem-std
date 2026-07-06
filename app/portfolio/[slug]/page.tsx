import { notFound } from 'next/navigation';
import { Project } from '@/types';
import ProjectDetailView from '@/components/ProjectDetailView';
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

