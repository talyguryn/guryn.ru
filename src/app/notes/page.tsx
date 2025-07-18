import Link from 'next/link';
import { formatDate, getNotesPosts, getTagsWithCount } from '@/app/notes/utils';
import Tag from '../components/Tag';

export default async function Page() {
  const allNotes = getNotesPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const tagCounts = getTagsWithCount();

  return (
    <>
      <h1>Заметки</h1>

      <div>
        {allNotes.map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/notes/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[150px] tabular-nums">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Темы</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {tagCounts.map(({ tag, count }) => (
          <Tag key={tag} tag={tag} count={count} />
        ))}
      </div>
    </>
  );
}
