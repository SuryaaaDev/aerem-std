import { createClient } from '@/lib/supabase/server';
import {
  isAllowedImageMime,
  MAX_UPLOAD_BYTES,
  optimizeImage,
  type ImageUploadType,
} from '@/lib/image/optimize';
import { NextResponse } from 'next/server';

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

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);
    const originalSize = inputBuffer.byteLength;

    const uploadType: ImageUploadType = type === 'thumbnail' ? 'thumbnail' : 'mockup';
    const { buffer, contentType, extension } = await optimizeImage(inputBuffer, uploadType);

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(fileName);

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
