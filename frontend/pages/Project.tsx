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
          background: 'linear-gradient(to right, rgb(49, 46, 129), rgb(129, 140, 248))',
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
  
  const useGitHubAuth = () => {
    const [accessToken, setAccessToken] = useState<string | null>(
      localStorage.getItem('github_token')
    );
  
    useEffect(() => {
      // URL에서 코드 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
  
      if (code) {
        // 코드를 액세스 토큰으로 교환
        exchangeCodeForToken(code);
        // URL에서 코드 제거
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }, []);
  
    const exchangeCodeForToken = async (code: string) => {
      try {
        // 실제 구현에서는 백엔드 서버로 요청을 보내야 합니다
        const response = await fetch('/api/github/callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });
        
        const data = await response.json();
        if (data.access_token) {
          localStorage.setItem('github_token', data.access_token);
          setAccessToken(data.access_token);
        }
      } catch (error) {
        console.error('Failed to exchange code for token:', error);
      }
    };
  
    const login = () => {
      const params = new URLSearchParams({
        client_id: GITHUB_CONFIG.CLIENT_ID,
        redirect_uri: GITHUB_CONFIG.REDIRECT_URI,
        scope: 'repo',
        state: crypto.randomUUID() // CSRF 방지를 위한 상태 토큰
      });
  
      window.location.href = `${GITHUB_CONFIG.OAUTH_URL}?${params.toString()}`;
    };
  
    const logout = () => {
      localStorage.removeItem('github_token');
      setAccessToken(null);
    };
  
    return { accessToken, login, logout };
  };
  
  const ProjectGallery: React.FC = () => {
    const [projects, setProjects] = useState<GitHubRepo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { accessToken, login, logout } = useGitHubAuth();
  
    useEffect(() => {
      if (accessToken) {
        fetchProjects();
      } else {
        setIsLoading(false);
      }
    }, [accessToken]);
  
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${GITHUB_CONFIG.API_URL}/user/repos`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold mb-2">
              {}유저 아이디값받기 프로젝트에 오신 것을 환영합니다.
              </h1>
              {accessToken && (
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  로그아웃
                </button>
              )}
            </div>
            <p className="text-gray-400">
              프로젝트로 이동
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessToken && projects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  title={project.name}
                  description={project.description}
                  onClick={() => window.open(project.html_url, '_blank')}
                />
              ))}
              <ProjectCard 
                title={accessToken ? "새 프로젝트 생성하기" : "GitHub 로그인"}
                isCreateNew={true}
                onClick={accessToken ? () => window.open('https://github.com', '_blank') : login}
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ProjectGallery;