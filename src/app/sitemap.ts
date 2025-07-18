import { getNotesPosts, getTagsWithCount } from '@/app/notes/utils';
import { getHost } from '@/utils/host';

export const baseUrl = getHost();

export default async function sitemap() {
  const sitemapList = [];

  let routes = ['/', '/notes'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
  sitemapList.push(...routes);

  let notes = getNotesPosts().map((post) => ({
    url: `${baseUrl}/notes/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));
  sitemapList.push(...notes);

  let tags = getTagsWithCount().map(({ tag }) => ({
    url: `${baseUrl}/notes/tags/${tag}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
  sitemapList.push(...tags);

  return sitemapList;
}
