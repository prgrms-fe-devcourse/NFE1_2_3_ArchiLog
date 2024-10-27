// src/pages/project.tsx
import { useEffect, useState } from 'react';
import { Github, Star, GitFork, Clock, Trash2, Plus } from 'lucide-react';
import { addProject, deleteProject, getProjects } from '../firebase/projects';

interface Project {
  id: string;
  userId: string;
  repoUrl: string;
  customDescription: string;
  createdAt: number;
  repoInfo: {
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    topics?: string[];
    updated_at: string;
  };
}

function AddProjectModal({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { repoUrl: string; description: string }) => Promise<void>;
}) {
  const [repoUrl, setRepoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({ repoUrl, description });
      setRepoUrl('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-black mb-6">프로젝트</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="프로젝트에 대한 간단한 설명"
              className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? '프로젝트 추가 중...' : '프로젝트 추가'}
          </button>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('프로젝트를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (data: { repoUrl: string; description: string }) => {
    try {
      await addProject(data.repoUrl, data.description, 'user123');
      fetchProjects();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!window.confirm('이 프로젝트를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      await deleteProject(projectId, 'user123');
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('프로젝트 삭제 실패:', error);
      alert('프로젝트 삭제에 실패했습니다');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Project</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>
        
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <a
                key={project.id}
                href={project.repoInfo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group overflow-hidden rounded-xl p-6 bg-white border border-gray-300 hover:border-gray-400 transition-all duration-300 shadow-sm"
              >
                {project.userId === 'user123' && (
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Github className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-black truncate">
                      {project.repoInfo.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.customDescription || project.repoInfo.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {project.repoInfo.language && (
                      <span className="flex items-center space-x-1">
                        <span className={`w-3 h-3 rounded-full bg-${getLanguageColor(project.repoInfo.language)}`} />
                        <span>{project.repoInfo.language}</span>
                      </span>
                    )}
                    
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{project.repoInfo.stargazers_count}</span>
                    </span>
                    
                    <span className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4" />
                      <span>{project.repoInfo.forks_count}</span>
                    </span>
                  </div>

                  {project.repoInfo.topics && project.repoInfo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.repoInfo.topics.map((topic) => (
                        <span 
                          key={topic}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 border border-gray-200"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Added {formatDate(new Date(project.createdAt).toString())}</span>
                    </span>
                  </div>
                </div>
              </a>
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

const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    JavaScript: 'yellow-500',
    TypeScript: 'blue-500',
    Python: 'green-500',
    Java: 'red-500',
    'C++': 'purple-500',
    Ruby: 'red-600',
    Go: 'cyan-500',
    PHP: 'indigo-500',
    default: 'gray-500'
  };

  return colors[language] || colors.default;
};