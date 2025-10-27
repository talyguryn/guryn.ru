'use client';

import { PlusIcon, TrashIcon } from 'lucide-react';
import { Project } from '../types';

interface SidebarProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onAddProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

const DEFAULT_PROJECT_NAME = 'Цель без названия';

export default function Sidebar({
  projects,
  currentProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
}: SidebarProps) {
  return (
    <aside className="w-80 bg-gray-50 h-screen sticky top-0 flex flex-col">
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Мои цели</h2>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4">
        {projects.length === 0 ? (
          <div className="text-gray-500 py-4">
            Здесь будет список ваших целей. Создайте первую цель.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {projects.map((project) => {
              const progress =
                project.steps.length === 0
                  ? 0
                  : (project.steps.filter((s) => s.isDone).length /
                      project.steps.length) *
                    100;

              return (
                <div key={project.id} className="relative group cursor-pointer">
                  <div
                    onClick={() => onSelectProject(project.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      currentProjectId === project.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-white hover:bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {project.name || DEFAULT_PROJECT_NAME}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-green-500 h-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity cursor-pointer"
                        title="Удалить проект"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={onAddProject}
              className="w-full px-4 py-2 mb-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              Добавить новую цель
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
