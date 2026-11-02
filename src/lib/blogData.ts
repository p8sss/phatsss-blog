import useGlobalData from '@docusaurus/useGlobalData';

export type PostAuthor = {
  name?: string;
  title?: string;
  imageURL?: string;
};

export type PostSummary = {
  slug: string;
  title: string;
  permalink: string;
  date: string;
  description: string;
  excerpt: string;
  tags: {label: string; permalink: string}[];
  language: string;
  readingTime: number;
  author?: PostAuthor;
};

export type BlogTag = {
  label: string;
  permalink: string;
  count: number;
};

type BlogGlobalData = {
  'docusaurus-blog-tags'?: {
    default?: {
      blogTags?: Record<string, BlogTag>;
      blogPosts?: PostSummary[];
    };
  };
};

export function useBlogData(): {
  blogTags?: Record<string, BlogTag>;
  blogPosts?: PostSummary[];
} {
  const globalData = useGlobalData() as BlogGlobalData;
  return globalData['docusaurus-blog-tags']?.default ?? {};
}
