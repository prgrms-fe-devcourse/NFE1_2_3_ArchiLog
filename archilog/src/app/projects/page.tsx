
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/hook/useAuth';
import { ProjectHeader } from '@/app/components/project/ProjectCard';
import { ProjectCard } from '@/app/components/project/ProjectCard';
import { AddProjectModal } from '@/app/components/project/Editor';
import type { Project } from '@/types/Project';
import { GithubLogin } from '@/app/components/project/GithubLogin';
import { PostForm } from '@/app/components/project/PostForm';

export default function ProjectPage() {
  const params = useParams();
  const username = params.username as string;
  const { darkMode } = useDarkMode();
  const { user } = useAuth();
  const { projects, loading, error, refetch } = useProjects(username);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasPermission = Boolean(user?.displayName === username);

  const handleAddProject = async (data: {
    repoUrl: string;
    description: string;
  }) => {
    if (!user || !hasPermission) return;

    try {
      await projectService.addProject(data.repoUrl, data.description, username);
      await refetch();
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (
    projectId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    if (!user?.displayName) return;

    if (!window.confirm("이 프로젝트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await projectService.deleteProject(projectId, user.displayName);
      await refetch();
    } catch (error) {
      console.error("프로젝트 삭제 실패:", error);
      alert("프로젝트 삭제에 실패했습니다");
    }
  };

  if (loading) return null; // loading.tsx가 대신 표시됨

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-8">
        <ProjectHeader 
          hasPermission={hasPermission} 
          onAddClick={() => setIsModalOpen(true)}
          darkMode={darkMode}
        />

        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                hasPermission={hasPermission}
                onDelete={handleDeleteProject}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}

        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddProject}
        />
      </div>
    </div>
  );
}