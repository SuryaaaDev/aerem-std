import sharp from 'sharp';

export type ImageUploadType = 'thumbnail' | 'mockup';

const PRESETS: Record<
  ImageUploadType,
  { maxWidth: number; maxHeight: number; quality: number }
> = {
  // Portfolio cards & cover — 4:5 ratio, displayed ~800px wide
  thumbnail: { maxWidth: 900, maxHeight: 1125, quality: 78 },
  // Detail page mockups — max display ~1600px wide
  mockup: { maxWidth: 1600, maxHeight: 1600, quality: 80 },
};

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB raw input cap

export function isAllowedImageMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime);
}

export async function optimizeImage(
  input: Buffer,
  type: ImageUploadType = 'mockup'
): Promise<{ buffer: Buffer; contentType: string; extension: string }> {
  const preset = PRESETS[type];

  const buffer = await sharp(input)
    .rotate()
    .resize({
      width: preset.maxWidth,
      height: preset.maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: preset.quality, effort: 4 })
    .toBuffer();

  return {
    buffer,
    contentType: 'image/webp',
    extension: 'webp',
  };
}
