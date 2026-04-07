import fs from 'fs';
import path from 'path';
import { GalleryGrid } from './GalleryGrid';

export async function Gallery() {
  const galleryDir = path.join(process.cwd(), 'public', 'images', 'Gallery');
  let images: string[] = [];

  try {
    const files = await fs.promises.readdir(galleryDir);
    images = files
      .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
      });
  } catch (error) {
    // Directory might not exist or be empty
    return null;
  }

  if (images.length === 0) return null;

  return (
    <section className="relative py-20 bg-transparent">
      <div className="container relative z-10 mx-auto px-4">
        <h2 className="mb-12 text-center text-4xl font-bold text-[var(--color-text-primary)] md:text-5xl">
          גלריה
        </h2>
        
        <GalleryGrid images={images} />
      </div>
    </section>
  );
}
