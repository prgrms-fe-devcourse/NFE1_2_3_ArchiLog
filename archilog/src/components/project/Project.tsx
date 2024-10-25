import React from 'react';
// import { useState, useEffect } from 'react';
// import { Github, Loader2 } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  isCreateNew?: boolean;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  title,
  isCreateNew,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative 
        overflow-hidden 
        rounded-xl 
        p-4 
        h-48 
        cursor-pointer 
        transition-all 
        duration-300
        ${isCreateNew 
          ? 'bg-gradient-to-r from-pink-500/20 to-blue-500/20 hover:from-pink-500/30 hover:to-blue-500/30'
          : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30'
        }
        border-2
        border-transparent
        hover:border-gray-700
        group
      `}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
        <div className={`
          w-14 
          h-14 
          rounded-full 
          flex 
          items-center 
          justify-center
          bg-gradient-to-r
          ${isCreateNew 
            ? 'from-pink-500 to-blue-500'
            : 'from-blue-500 to-purple-500'
          }
          group-hover:scale-110
          transition-transform
          duration-300
        `}>
          {isCreateNew ? (
            <span className="text-2xl text-white font-bold">+</span>
          ) : (
            <span className="text-2xl text-white">★</span>
          )}
        </div>
        
        <h3 className="text-white text-center font-medium px-4 py-2 rounded-lg backdrop-blur-sm bg-black/30">
          {title}
        </h3>
      </div>
      
      <div className="absolute inset-0 border-2 border-transparent rounded-xl group-hover:border-gray-700 transition-colors duration-300" />
    </div>
  );
};

const ProjectGallery: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-purple-500 inline-block text-transparent bg-clip-text">
            프로젝트
          </h1>
          <p className="text-gray-400">
            프로젝트를 누르시면 깃허브로 이동하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard 
            title="프로그래머스 3차 프로젝트"
            onClick={() => window.open('https://github.com/your-repo-url', '_blank')}
          />
          <ProjectCard 
            title="+ 프로젝트 생성하기" 
            isCreateNew={true}
            onClick={() => window.open('https://github.com/new', '_blank')}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;