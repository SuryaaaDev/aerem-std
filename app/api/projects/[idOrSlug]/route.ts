import { createClient } from '@/lib/supabase/server';
import {
  collectProjectImageUrls,
  deletePortfolioImages,
} from '@/lib/storage/portfolio-images';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  const { idOrSlug } = await params;
  const supabase = await createClient();

  // Try to fetch by slug first, then by ID if that makes sense, 
  // but usually slug is unique.
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', idOrSlug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  const { idOrSlug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { data: existing } = await supabase
      .from('projects')
      .select('thumbnail, mockups')
      .eq('id', idOrSlug)
      .single();

    const { error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', idOrSlug);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (existing) {
      const oldUrls = collectProjectImageUrls(existing);
      const newUrls = collectProjectImageUrls(body);
      const removedUrls = oldUrls.filter((url) => !newUrls.includes(url));
      await deletePortfolioImages(supabase, removedUrls);
    }

    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idOrSlug: string }> }
) {
  const { idOrSlug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from('projects')
    .select('thumbnail, mockups')
    .eq('id', idOrSlug)
    .single();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', idOrSlug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (existing) {
    await deletePortfolioImages(supabase, collectProjectImageUrls(existing));
  }

  return NextResponse.json({ message: 'Project deleted successfully' });
}
