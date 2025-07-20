import Link from 'next/link';
import { formatDate, getNotesPosts, getTagsWithCount } from '@/app/notes/utils';
import Tag from '../components/Tag';
import NoteCard from '../components/NoteCard';

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
          <div key={post.slug} className="mb-2">
            <NoteCard post={post} />
          </div>
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
