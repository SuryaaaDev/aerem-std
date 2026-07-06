import { createClient as createServiceClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const BUCKET = 'portfolio-images';
const STORAGE_LIMIT_BYTES = 50 * 1024 * 1024; // 50 MB Supabase free tier
const WARN_THRESHOLD = 0.85; // warn at 85%

async function getBucketSize(): Promise<number> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return 0;

  const admin = createServiceClient(url, serviceKey);
  let totalBytes = 0;
  let offset = 0;
  const limit = 100;

  // Paginate through all files in the bucket
  while (true) {
    const { data, error } = await admin.storage.from(BUCKET).list('', {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error || !data || data.length === 0) break;

    for (const file of data) {
      totalBytes += file.metadata?.size ?? 0;
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return totalBytes;
}

export async function GET() {
  // Only accessible by authenticated admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const usedBytes = await getBucketSize();
  const usedMB = usedBytes / (1024 * 1024);
  const limitMB = STORAGE_LIMIT_BYTES / (1024 * 1024);
  const usagePercent = usedBytes / STORAGE_LIMIT_BYTES;
  const isNearLimit = usagePercent >= WARN_THRESHOLD;
  const isAtLimit = usedBytes >= STORAGE_LIMIT_BYTES;

  return NextResponse.json({
    usedBytes,
    usedMB: Math.round(usedMB * 100) / 100,
    limitMB,
    usagePercent: Math.round(usagePercent * 1000) / 10, // e.g. 85.3
    isNearLimit,
    isAtLimit,
  });
}
