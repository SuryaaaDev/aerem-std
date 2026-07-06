import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import {
  isAllowedImageMime,
  MAX_UPLOAD_BYTES,
  optimizeImage,
  type ImageUploadType,
} from '@/lib/image/optimize';
import { NextResponse } from 'next/server';

const BUCKET = 'portfolio-images';
const STORAGE_LIMIT_BYTES = 50 * 1024 * 1024; // 50 MB free tier
const SAFETY_MARGIN_BYTES = 2 * 1024 * 1024;  // block if < 2 MB remaining

async function getBucketSize(): Promise<number> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return 0;

  const admin = createServiceClient(url, serviceKey);
  let totalBytes = 0;
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await admin.storage.from(BUCKET).list('', {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });
    if (error || !data || data.length === 0) break;
    for (const file of data) totalBytes += file.metadata?.size ?? 0;
    if (data.length < limit) break;
    offset += limit;
  }

  return totalBytes;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;
    const type = (form.get('type') as ImageUploadType | null) ?? 'mockup';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!isAllowedImageMime(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, WebP, GIF, or AVIF images are allowed' },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum upload size is 15 MB.' },
        { status: 400 }
      );
    }

    // Check storage capacity before processing
    const usedBytes = await getBucketSize();
    const remainingBytes = STORAGE_LIMIT_BYTES - usedBytes;

    if (remainingBytes < SAFETY_MARGIN_BYTES) {
      const usedMB = (usedBytes / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Storage almost full (${usedMB}/50 MB used). Delete unused images before uploading.`,
          storageError: true,
          usedBytes,
          limitBytes: STORAGE_LIMIT_BYTES,
        },
        { status: 507 } // 507 Insufficient Storage
      );
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);
    const originalSize = inputBuffer.byteLength;

    const uploadType: ImageUploadType = type === 'thumbnail' ? 'thumbnail' : 'mockup';
    const { buffer, contentType, extension } = await optimizeImage(inputBuffer, uploadType);

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    const optimizedSize = buffer.byteLength;
    const savedPercent =
      originalSize > 0
        ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
        : 0;

    return NextResponse.json({
      url: data.publicUrl,
      originalSize,
      optimizedSize,
      savedPercent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
