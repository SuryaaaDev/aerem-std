import { createClient } from '@/lib/supabase/server';
import AdminDashboard from '@/components/AdminDashboard';
import { Project } from '@/types';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects — code:', error.code, '| message:', error.message, '| details:', error.details, '| hint:', error.hint);
  }

  const projects = (data || []) as Project[];

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboard initialProjects={projects} />
    </div>
  );
}
