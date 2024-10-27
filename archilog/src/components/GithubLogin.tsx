// src/components/project/GithubLogin.tsx
import { Github } from 'lucide-react';

export default function GitHubLogin() {
  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Project Gallery</h1>
        <button
          onClick={handleLogin}
          className="flex items-center space-x-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
        >
          <Github className="w-5 h-5" />
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  );
}