import { formatDate, getNotesPosts } from '@/app/notes/utils';
import ProjectsBlock from './components/ProjectsBlock';
import NotesBlock from './components/NotesBlock';

export default async function Page() {
  return (
    <div>

      <NotesBlock />
      <ProjectsBlock />
    </div>
  );
}
