// import { getNotesPosts } from '@/app/notes/utils';

export const baseUrl = 'https://guryn.ru';

export default async function sitemap() {
  const sitemapList = [];

  // let notes = getNotesPosts().map((post) => ({
  //   url: `${baseUrl}/notes/${post.slug}`,
  //   lastModified: post.metadata.publishedAt,
  // }));
  // sitemapList.push(...notes);

  let routes = ['/'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
  sitemapList.push(...routes);

  return sitemapList;
}
