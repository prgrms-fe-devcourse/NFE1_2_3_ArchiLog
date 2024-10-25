// src/pages/project.tsx
import { useEffect, useState } from 'react';
import GithubLogin from '../components/project/GitHubLogin';
import ProjectList from '../components/project/ProjectList';
import { MainLayout } from '../components/Layout/MainLayout';

export default function ProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/github/repos');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <GithubLogin />;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Project Gallery</h1>
          <button
            onClick={() => {
              document.cookie = 'github_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
        <ProjectList />
      </div>
    </MainLayout>
  );
}