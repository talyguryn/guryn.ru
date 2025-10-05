import NoteCard from '@/app/components/NoteCard';
import { notFound } from 'next/navigation';
import {
  getNotesPosts,
  getProjectsWithCount,
  getTagsWithCount,
} from '@/app/notes/utils';
import type { NotePost } from '@/app/notes/utils';
import Tag, { colorType } from '@/app/components/Tag';

export async function generateStaticParams() {
  const staticParams: Array<{ tag: string }> = [];

  const projects = getProjectsWithCount();
  const tags = getTagsWithCount();

  projects.forEach(({ project }) => {
    staticParams.push({ tag: project });
  });

  tags.forEach(({ tag }) => {
    staticParams.push({ tag });
  });

  return staticParams;
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

  const listedTags = getTagsWithCount().map(({ tag }) => tag);
  const listedProjects = getProjectsWithCount().map(({ project }) => project);

  const filteredPostsByTag = posts.filter(
    (post) => post.metadata.tags && post.metadata.tags.includes(tag)
  );
  const filteredPostsByProject = posts.filter(
    (post) => post.metadata.projects && post.metadata.projects.includes(tag)
  );

  if (filteredPostsByTag.length === 0 && filteredPostsByProject.length === 0) {
    return notFound();
  }

  return (
    <section>
      {/* if tag exists */}
      {filteredPostsByTag.length > 0 && (
        <>
          <h1 className="title font-semibold text-2xl tracking-tighter !mb-6">
            Заметки на тему «{tag}»
          </h1>
          <div className="flex flex-col gap-1">
            {filteredPostsByTag.map((post: NotePost) => (
              <NoteCard key={post.slug} post={post} />
            ))}
          </div>

          {/* show other tags for other tags list */}
          <div className="mt-6">
            <div className="text-lg font-semibold mb-2">
              Показать заметки на другие темы
            </div>
            <div className="flex flex-wrap gap-2">
              {listedTags
                ?.filter((t) => t !== tag)
                .map((tag: string) => (
                  <Tag key={tag} tag={tag} />
                ))}
            </div>
          </div>
        </>
      )}

      {/* if project exists */}
      {filteredPostsByProject.length > 0 && (
        <div className="mt-8">
          <h1 className="title font-semibold text-xl tracking-tighter !mb-6">
            Заметки по проекту «{tag}»
          </h1>
          <div className="flex flex-col gap-1">
            {filteredPostsByProject.map((post: NotePost) => (
              <NoteCard key={post.slug} post={post} />
            ))}
          </div>

          {/* show project tags for other projects list */}
          <div className="mt-6">
            <div className="text-lg font-semibold mb-2">
              Показать заметки о других проектах
            </div>
            <div className="flex flex-wrap gap-2">
              {listedProjects
                ?.filter((project) => project !== tag)
                .map((project: string) => (
                  <Tag key={project} tag={project} color={colorType.red} />
                ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
