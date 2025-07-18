import { formatDate } from '@/app/notes/utils';
import type { NotePost } from '@/app/notes/utils';

export default function NoteCard({ post }: { post: NotePost }) {
  return (
    <div className="pb-4">
      <a
        href={`/notes/${post.slug}`}
        className="hover:underline text-lg font-semibold"
      >
        {post.metadata.title}
      </a>

      <div className="mt-2 text-neutral-800 dark:text-neutral-200">
        {post.metadata.summary}
      </div>
    </div>
  );
}
