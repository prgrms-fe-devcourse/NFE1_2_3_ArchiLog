import { Github, Star, GitFork, Trash2, Clock } from 'lucide-react';
import type { Project } from '@/types/Project';
import { formatDate } from '@/utils/Logo';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string, e: React.MouseEvent) => Promise<void>;
  hasPermission: boolean;
  darkMode: boolean;
}

export const ProjectCard = ({ project, onDelete, hasPermission, darkMode }: ProjectCardProps) => (
  
    href={project.repoInfo.html_url}
    target="_blank"
    rel="noopener noreferrer"
    className={`relative group overflow-hidden rounded-xl p-6 ${
      darkMode
        ? 'bg-black border-gray-800 hover:border-gray-700'
        : 'bg-white border-gray-300 hover:border-gray-400'
    } border transition-all duration-300 shadow-sm`}
  >
    {hasPermission && onDelete && (
      <button
        onClick={(e) => onDelete(project.id, e)}
        className={`absolute top-3 right-3 p-2 rounded-full ${
          darkMode
            ? 'bg-gray-900 text-gray-400 hover:bg-red-900 hover:text-red-400'
            : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
        } transition-all duration-200 opacity-0 group-hover:opacity-100 z-10`}
      >
        <Trash2 className="w-5 h-5" />
      </button>
    )}
    {/* ... ProjectCard 내용 ... */}
  </a>
);