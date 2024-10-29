import React from 'react';
import { Github } from 'lucide-react';
import { signInWithGithubPopup } from '@/firebase/auth'; 
import { useRouter } from 'next/router';

export default function GitHubLogin() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithGithubPopup();
      router.push('/'); 
    } catch (error) {
      console.error('GitHub 로그인 실패:', error);
      alert('GitHub 로그인에 실패했습니다. 다시 시도해주세요.');
    }
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