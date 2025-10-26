import ProjectsBlock from './components/ProjectsBlock';
import NotesBlock from './components/NotesBlock';

export const metadata = {
  title: 'Виталий Гурын',
  description: 'Мои проекты и заметки об экспериментах в IT',
};

export default async function Page() {
  return (
    <div>
      <NotesBlock />
      <ProjectsBlock />
    </div>
  );
}
