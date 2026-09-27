import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post, Taxonomy } from '~/types';
import { APP_BLOG } from 'astrowind:config';
import { cleanSlug, trimSlash, BLOG_BASE, POST_PERMALINK_PATTERN, CATEGORY_BASE, TAG_BASE } from './permalinks';

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

const CANONICAL_OPEN_WORLD_SLUGS: Record<string, string> = {
  'rankings': 'rankings',
  'rankings-and-indices': 'rankings',
  'paradoxes': 'paradoxes',
  'geographic-paradoxes': 'paradoxes',
  'extremes': 'extremes',
  'earth-extremes': 'extremes',
  'borders': 'borders',
  'borders-and-frontiers': 'borders',
  'borders-and-territories': 'borders',
  'micronations': 'micronations',
  'abandoned': 'abandoned',
  'ghost-towns-and-ruins': 'abandoned',
  'enigmas': 'enigmas',
  'earth-enigmas': 'enigmas',
  'indigenous': 'indigenous',
  'indigenous-peoples': 'indigenous',
};

export const resolveCategorySlug = (rawCategory: string): string => {
  const base = cleanSlug(rawCategory);
  return CANONICAL_OPEN_WORLD_SLUGS[base] || base;
};

export const OPEN_WORLD_CATEGORIES: Record<string, Taxonomy> = {
  'world-landmarks': {
    slug: 'world-landmarks',
    title: 'World Landmarks',
  },
  'castles-and-palaces': {
    slug: 'castles-and-palaces',
    title: 'Castles & Palaces',
  },
  'cities-and-capitals': {
    slug: 'cities-and-capitals',
    title: 'Cities & Capitals',
  },
  'natural-wonders': {
    slug: 'natural-wonders',
    title: 'Natural Wonders',
  },
  'street-view-and-discovery': {
    slug: 'street-view-and-discovery',
    title: 'Street View & Routes',
  },
  'countries-and-territories': {
    slug: 'countries-and-territories',
    title: 'Countries & Territories',
  },
  'flags-and-symbols': {
    slug: 'flags-and-symbols',
    title: 'Flags & Symbols',
  },
  'culture-and-arts': {
    slug: 'culture-and-arts',
    title: 'Culture & Arts',
  },
  'history-and-civilization': {
    slug: 'history-and-civilization',
    title: 'History & Civilization',
  },
  rankings: {
    slug: 'rankings',
    title: 'Rankings & Indices',
  },
  paradoxes: {
    slug: 'paradoxes',
    title: 'Geographic Paradoxes',
  },
  extremes: {
    slug: 'extremes',
    title: 'Earth Extremes',
  },
  borders: {
    slug: 'borders',
    title: 'Borders & Frontiers',
  },
  micronations: {
    slug: 'micronations',
    title: 'Micronations',
  },
  abandoned: {
    slug: 'abandoned',
    title: 'Ghost Towns & Ruins',
  },
  enigmas: {
    slug: 'enigmas',
    title: 'Earth Enigmas',
  },
  indigenous: {
    slug: 'indigenous',
    title: 'Indigenous Peoples',
  },
};

const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    imageAlt,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {},
  } = data;

  const rawIdWithoutExt = id.replace(/\.(md|mdx)$/i, '');
  const slug = cleanSlug(rawIdWithoutExt);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const KNOWN_LANG_CODES = ['es', 'fr', 'de', 'pt', 'it', 'nl', 'sv', 'tr', 'ar'];
  let lang = data.lang || 'en';
  let baseSlug = data.baseSlug || slug;
  let isTranslation = data.isTranslation;

  if (isTranslation === undefined) {
    for (const loc of KNOWN_LANG_CODES) {
      if (slug.endsWith(`-${loc}`) || rawIdWithoutExt.endsWith(`-${loc}`)) {
        lang = loc;
        baseSlug = slug.slice(0, -(loc.length + 1));
        isTranslation = true;
        break;
      }
    }
  }
  if (isTranslation === undefined) {
    isTranslation = false;
  }

  const category = rawCategory
    ? {
        slug: resolveCategorySlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    lang: lang,
    baseSlug: baseSlug,
    isTranslation: isTranslation,
    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),

    publishDate: publishDate,
    updateDate: updateDate,

    title: title,
    excerpt: excerpt,
    image: image,
    imageAlt: imageAlt,

    category: category,
    tags: tags,
    author: author,

    draft: draft,

    metadata,

    Content: Content,
    // or 'content' in case you consume from API

    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post');
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/** */
export const fetchPosts = async (options?: { includeTranslations?: boolean }): Promise<Array<Post>> => {
  if (!_posts || import.meta.env.DEV) {
    _posts = await load();
  }

  if (options?.includeTranslations) {
    return _posts;
  }

  // Filter out translations by default so that the home page, categories, tags, search,
  // and related posts always display 1 canonical article per topic instead of 10 localized duplicates.
  return _posts.filter((post) => !post.isTranslation);
};

/** */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = await fetchPosts();

  return posts ? posts.slice(0, _count) : [];
};

/** */
export const getStaticPathsBlogList = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogPostsPerPage,
  });
};

/** */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts({ includeTranslations: true })).flatMap((post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsBlogCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const categories: Record<string, Taxonomy> = {
    ...OPEN_WORLD_CATEGORIES,
  };
  posts.map((post) => {
    if (post.category?.slug) {
      categories[post.category.slug] = post.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      posts.filter((post) => post.category?.slug && categorySlug === post.category?.slug),
      {
        params: { category: categorySlug, blog: CATEGORY_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPosts();
  const tags: Record<string, Taxonomy> = {};
  posts.map((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.map((tag) => {
        tags[tag.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.slug === tagSlug)),
      {
        params: { tag: tagSlug, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedPosts(originalPost: Post, maxResults: number = 4): Promise<Post[]> {
  const allPosts = await fetchPosts();
  const originalTagsSet = new Set(originalPost.tags ? originalPost.tags.map((tag) => tag.slug) : []);

  const postsWithScores = allPosts.reduce((acc: { post: Post; score: number }[], iteratedPost: Post) => {
    if (iteratedPost.slug === originalPost.slug) return acc;

    let score = 0;
    if (iteratedPost.category && originalPost.category && iteratedPost.category.slug === originalPost.category.slug) {
      score += 5;
    }

    if (iteratedPost.tags) {
      iteratedPost.tags.forEach((tag) => {
        if (originalTagsSet.has(tag.slug)) {
          score += 1;
        }
      });
    }

    acc.push({ post: iteratedPost, score });
    return acc;
  }, []);

  postsWithScores.sort((a, b) => b.score - a.score);

  const selectedPosts: Post[] = [];
  let i = 0;
  while (selectedPosts.length < maxResults && i < postsWithScores.length) {
    selectedPosts.push(postsWithScores[i].post);
    i++;
  }

  return selectedPosts;
}
