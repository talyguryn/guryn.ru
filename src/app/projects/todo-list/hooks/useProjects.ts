'use client';

import { useEffect, useState } from 'react';
import { LocalStorageDatabase } from '@/utils/db';
import { Project, Step } from '../types';

const db = new LocalStorageDatabase('todo-projects');

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from database
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const storedProjects = await db.get('projects');
        if (storedProjects && Array.isArray(storedProjects)) {
          setProjects(storedProjects as Project[]);

          // Load last active project
          const lastActiveId = await db.get('lastActiveProjectId');
          if (lastActiveId && typeof lastActiveId === 'string') {
            setCurrentProjectId(lastActiveId);
          } else if ((storedProjects as Project[]).length > 0) {
            setCurrentProjectId((storedProjects as Project[])[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Save projects to database
  useEffect(() => {
    if (!isLoading) {
      db.set('projects', projects);
    }
  }, [projects, isLoading]);

  // Save last active project
  useEffect(() => {
    if (!isLoading && currentProjectId) {
      db.set('lastActiveProjectId', currentProjectId);
    }
  }, [currentProjectId, isLoading]);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      steps: [{ text: '', isDone: false }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjects([...projects, newProject]);
    setCurrentProjectId(newProject.id);

    // Focus on name input after a short delay
    setTimeout(() => {
      const nameInput = document.querySelector(
        'input[placeholder="Что делаем?"]'
      ) as HTMLInputElement;
      if (nameInput) {
        nameInput.focus();
      }
    }, 50);
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);

    if (currentProjectId === projectId) {
      setCurrentProjectId(
        updatedProjects.length > 0 ? updatedProjects[0].id : null
      );
    }
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(
      projects.map((p) =>
        p.id === projectId ? { ...p, ...updates, updatedAt: Date.now() } : p
      )
    );
  };

  const currentProject =
    projects.find((p) => p.id === currentProjectId) || null;

  return {
    projects,
    currentProject,
    currentProjectId,
    isLoading,
    setCurrentProjectId,
    addProject,
    deleteProject,
    updateProject,
  };
}
