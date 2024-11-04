'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { projectService } from '@/services/project';

export const useProjects = (username: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      if (!username) {
        setError("Username is required");
        return;
      }

      const projectsList = await projectService.fetchProjects(username);
      setProjects(projectsList);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError("프로젝트를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchProjects();
    }
  }, [username]);

  return { projects, loading, error, refetch: fetchProjects };
};