// src/pages/project.tsx
import React, { useEffect, useState } from "react";
import { Github, Star, GitFork, Clock } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

export default function ProjectList() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/api/github');
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        const data = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group overflow-hidden rounded-xl p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-800 hover:border-gray-700 transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Github className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white truncate">
                  {repo.name}
                </h3>
              </div>
              
              {repo.description && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                {repo.language && (
                  <span className="flex items-center space-x-1">
                    <span className={`w-3 h-3 rounded-full bg-${getLanguageColor(repo.language)}`} />
                    <span>{repo.language}</span>
                  </span>
                )}
                
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{repo.stargazers_count}</span>
                </span>
                
                <span className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4" />
                  <span>{repo.forks_count}</span>
                </span>
              </div>

              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((topic) => (
                    <span 
                      key={topic}
                      className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Updated {formatDate(repo.updated_at)}</span>
              </div>
            </div>
          </a>
        ))}
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