import { GITHUB_CONFIG } from '../src/config/github';
import React, { useState, useEffect } from 'react';
import { Github, Loader2 } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description?: string;
  url?: string;
  isCreateNew?: boolean;
  onClick?: () => void;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  created_at: string;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title, 
  description, 
  url, 
  isCreateNew, 
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-xl bg-gray-900 p-4 h-48 cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        background: 'linear-gradient(to right, rgb(3, 3, 5), rgb(129, 140, 248))',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30" />
      <div className="flex flex-col items-center justify-center h-full space-y-3 relative z-10">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          {isCreateNew ? (
            <Github className="text-gray-800" size={24} />
          ) : (
            <span className="text-xl text-gray-800">★</span>
          )}
        </div>
        <h3 className="text-white text-center font-medium">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-200 text-center line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const ProjectGallery: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllRepos = async () => {
    try {
      const response = await fetch('https://api.github.com/users/snsdl0905/repos', {
        headers: {
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const data = await response.json();
      setRepos(data);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRepos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold mb-2">
              GitHub Repositories
            </h1>
          </div>
          <p className="text-gray-400">
            Repository List
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo) => (
              <ProjectCard 
                key={repo.id}
                title={repo.name}
                description={repo.description || 'No description available'}
                onClick={() => window.open(repo.html_url, '_blank')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectGallery;