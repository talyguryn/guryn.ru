import {
  getNotesPosts,
  getProjectsWithCount,
  getTagsWithCount,
} from '@/app/notes/utils';
import Tag, { colorType } from '../components/Tag';
import NoteCard from '../components/NoteCard';

export default async function Page() {
  const allNotes = getNotesPosts().sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1;
    }
    return 1;
  });

  const tagCounts = getTagsWithCount();
  const projectsCounts = getProjectsWithCount();

  return (
    <>
      <h1>Заметки</h1>

      <div>
        {allNotes.slice(0, 3).map((post) => (
          <div key={post.slug} className="mb-2">
            <NoteCard post={post} />
          </div>
        ))}
      </div>

      <div className="pt-4 pb-8">
        <div className=" font-semibold mb-3">Подборки заметок по темам</div>
        <div className="mb-4 flex flex-wrap gap-2">
          {tagCounts.map(({ tag, count }) => (
            <Tag key={tag} tag={tag} count={count} />
          ))}
        </div>
      </div>

      <div>
        {allNotes.slice(3).map((post) => (
          <div key={post.slug} className="mb-2">
            <NoteCard post={post} />
          </div>
        ))}
      </div>

      {/* <h2 className="text-lg font-semibold mb-4">Журналы проектов</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {projectsCounts.map(({ project, count }) => (
          <Tag
            key={project}
            tag={project}
            count={count}
            color={colorType.red}
          />
        ))}
      </div> */}
    </>
  );
}
