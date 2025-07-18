import NoteCard from '@/app/components/NoteCard';
import { notFound } from 'next/navigation';
import { getNotesPosts, getTagsWithCount } from '@/app/notes/utils';
import type { NotePost } from '@/app/notes/utils';

export async function generateStaticParams() {
  const tags = getTagsWithCount();
  return tags.map(({ tag }) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return {
    title: `Заметки на тему «${tag}»`,
    description: ``,
  };
}

export default async function NotesTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getNotesPosts();
  const filteredPosts = posts.filter(
    (post) => post.metadata.tags && post.metadata.tags.includes(tag)
  );

  if (filteredPosts.length === 0) {
    return notFound();
  }

  return (
    <section>
      <h1 className="title font-semibold text-2xl tracking-tighter mb-6">
        Заметки на тему «{tag}»
      </h1>
      <div className="flex flex-col gap-6">
        {filteredPosts.map((post: NotePost) => (
          <NoteCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
