import ProjectsBlock from './components/ProjectsBlock';
import NotesBlock from './components/NotesBlock';
import MainLayout from './components/layouts/Main';

export const metadata = {
  title: 'Виталий Гурын',
  description: 'Мои проекты и заметки об экспериментах в IT',
};

export default async function Page() {
  return (
    <MainLayout>
      <NotesBlock />
      <ProjectsBlock />
    </MainLayout>
  );
}
