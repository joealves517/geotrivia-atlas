import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';
import { findImage } from '~/utils/images';

// Prerender search.json so SSG build produces a static JSON file for zero-latency CDN serving
export const prerender = true;

export interface SearchIndexItem {
  id: string;
  slug: string;
  permalink: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  tags: string[];
  image: string;
  readingTime: number;
  publishDate: string;
}

const resolveImageSrc = async (img: unknown): Promise<string> => {
  if (!img) return '';
  if (typeof img === 'string') {
    const resolved = await findImage(img);
    if (resolved && typeof resolved === 'object' && 'src' in resolved) {
      return (resolved as { src: string }).src;
    }
    if (typeof resolved === 'string') return resolved;
    return img;
  }
  if (typeof img === 'object' && 'src' in img && typeof (img as { src: unknown }).src === 'string') {
    return (img as { src: string }).src;
  }
  return '';
};

export const GET = async () => {
  const posts = await fetchPosts({ includeTranslations: true });

  const searchIndex: SearchIndexItem[] = await Promise.all(
    posts.map(async (post) => ({
      id: post.id,
      slug: post.slug,
      permalink: getPermalink(post.permalink, 'post'),
      title: post.title,
      excerpt: post.excerpt || '',
      category: post.category?.title || 'General',
      categorySlug: post.category?.slug || '',
      tags: (post.tags || []).map((t) => t.title || t.slug),
      image: await resolveImageSrc(post.image),
      readingTime: post.readingTime || 5,
      publishDate: post.publishDate ? post.publishDate.toISOString() : new Date().toISOString(),
    }))
  );

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
};
