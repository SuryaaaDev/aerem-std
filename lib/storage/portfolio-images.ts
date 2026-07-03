import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'portfolio-images';

export function extractPortfolioImagePath(publicUrl: string): string | null {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const match = url.pathname.match(/\/portfolio-images\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export function isPortfolioStorageUrl(url: string): boolean {
  return url.includes('/portfolio-images/');
}

export function collectProjectImageUrls(project: {
  thumbnail?: string | null;
  mockups?: string[] | null;
}): string[] {
  const urls: string[] = [];
  if (project.thumbnail && isPortfolioStorageUrl(project.thumbnail)) {
    urls.push(project.thumbnail);
  }
  for (const url of project.mockups ?? []) {
    if (url && isPortfolioStorageUrl(url)) {
      urls.push(url);
    }
  }
  return urls;
}

export async function deletePortfolioImages(
  supabase: SupabaseClient,
  urls: (string | undefined | null)[]
): Promise<void> {
  const paths = [
    ...new Set(
      urls
        .filter((url): url is string => !!url && isPortfolioStorageUrl(url))
        .map(extractPortfolioImagePath)
        .filter((path): path is string => !!path)
    ),
  ];

  if (paths.length === 0) return;

  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) {
    console.error('Failed to delete portfolio images:', error.message);
  }
}
