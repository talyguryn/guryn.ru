'use client';

import './styles.css';
import { useEffect, useState } from 'react';
import Confetti from './confetti';
import { useProjects } from './hooks/useProjects';
import Sidebar from './components/Sidebar';
import ProjectHeader from './components/ProjectHeader';
import StepsList from './components/StepsList';
import ProgressFooter from './components/ProgressFooter';
import { Step } from './types';

export default function Page() {
  const {
    projects,
    currentProject,
    currentProjectId,
    isLoading,
    setCurrentProjectId,
    addProject,
    deleteProject,
    updateProject,
  } = useProjects();

  const [progress, setProgress] = useState(0);

  // Calculate progress when steps change
  useEffect(() => {
    if (!currentProject) {
      setProgress(0);
      return;
    }

    const steps = currentProject.steps;
    if (steps.length === 0) {
      setProgress(0);
      return;
    }

    const calculatedProgress =
      (steps.filter((step) => step.isDone).length / steps.length) * 100;

    if (calculatedProgress === 100 && progress !== 100) {
      new Confetti();
    }

    setProgress(calculatedProgress);
  }, [currentProject?.steps]);

  // Ensure at least one step exists
  useEffect(() => {
    if (
      currentProject &&
      (!currentProject.steps || currentProject.steps.length === 0)
    ) {
      updateProject(currentProject.id, {
        steps: [{ text: '', isDone: false }],
      });
    }
  }, [currentProject]);

  const handleNameChange = (name: string) => {
    if (currentProject) {
      updateProject(currentProject.id, { name });
    }
  };

  const handleStepsChange = (steps: Step[]) => {
    if (currentProject) {
      updateProject(currentProject.id, { steps });
    }
  };

  // order projects by updatedAt descending
  useEffect(() => {
    if (!isLoading) {
      const sortedProjects = [...projects].sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
      if (
        JSON.stringify(sortedProjects.map((p) => p.id)) !==
        JSON.stringify(projects.map((p) => p.id))
      ) {
        // Update projects order only if it has changed
        sortedProjects.forEach((p, index) => {
          if (projects[index]?.id !== p.id) {
            updateProject(p.id, {}); // Trigger re-render to update order
          }
        });
      }
    }
  }, [projects, isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        onAddProject={addProject}
        onDeleteProject={deleteProject}
      />

      <main className="flex-1 overflow-y-auto">
        {currentProject ? (
          <div className="max-w-3xl mt-30 mb-60 mx-auto p-4 flex flex-col">
            <ProjectHeader
              name={currentProject.name}
              progress={progress}
              onNameChange={handleNameChange}
            />

            <div className="flex flex-col py-4">
              <StepsList
                steps={currentProject.steps}
                onStepsChange={handleStepsChange}
              />

              <ProgressFooter progress={progress} />

              {progress === 100 && (
                <div className="mt-16">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={addProject}
                  >
                    Поставить новую цель
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <button
                onClick={addProject}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Создать первый проект
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
