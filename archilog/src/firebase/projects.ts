// src/firebase/projects.ts
import { ref, push, get, query, orderByChild, remove } from 'firebase/database';
import { database } from './firebase';
import { checkAuthenticated } from './posts';

// GitHub 저장소 정보 인터페이스
interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

// 프로젝트 데이터 인터페이스
interface ProjectData {
  username: string;
  repoUrl: string;
  customDescription: string;
  repoInfo: GitHubRepo;
  createdAt: number;
}

// GitHub URL에서 소유자와 저장소 이름 추출
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const repoPath = url.replace('https://github.com/', '').replace('.git', '');
    const [owner, repo] = repoPath.split('/');
    if (!owner || !repo) throw new Error('Invalid GitHub URL');
    return { owner, repo };
  } catch (error) {
    return null;
  }
}

// GitHub API를 통해 저장소 정보 가져오기
async function fetchRepoInfo(url: string): Promise<GitHubRepo> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error('Invalid GitHub repository URL');
  }

  const { owner, repo } = parsed;
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'ProjectGallery'
    }
  });

  if (!response.ok) {
    throw new Error('Repository not found or inaccessible');
  }

  return response.json();
}

// 새 프로젝트 추가
export async function addProject(repoUrl: string, description: string, username: string) {
  try {
    // GitHub API를 통해 저장소 정보 가져오기
    const repoInfo = await fetchRepoInfo(repoUrl);
    const user = checkAuthenticated();
    
    // 프로젝트 데이터 구성
    const projectData: ProjectData = {
      username,
      repoUrl,
      customDescription: description,
      repoInfo,
      createdAt: Date.now()
    };

    // Firebase에 데이터 저장
    const projectsRef = ref(database,`/users/${user.displayName}/projects`);
    const newProjectRef = await push(projectsRef, projectData);
    
    return {
      id: newProjectRef.key,
      ...projectData
    };
  } catch (error) {
    console.error('Error adding project:', error);
    throw error instanceof Error ? error : new Error('Failed to add project');
  }
}

// 모든 프로젝트 가져오기
export async function getProjects() {
  try {
    const user = checkAuthenticated();
    const projectsRef = ref(database, `/users/${user.displayName}/projects`);
    const projectsQuery = query(projectsRef, orderByChild('createdAt'));
    
    const snapshot = await get(projectsQuery);
    const projects: Array<ProjectData & { id: string }> = [];

    snapshot.forEach((child) => {
      if (child.key && child.val()) {
        projects.push({
          id: child.key,
          ...child.val()
        });
      }
    });

    // 최신순으로 정렬
    return projects.reverse();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch projects');
  }
}

// 단일 프로젝트 가져오기
export async function getProject(projectId: string) {
  try {
    const projectRef = ref(database, `projects/${projectId}`);
    const snapshot = await get(projectRef);
    
    if (!snapshot.exists()) {
      throw new Error('Project not found');
    }

    return {
      id: snapshot.key,
      ...snapshot.val()
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error instanceof Error ? error : new Error('Failed to fetch project');
  }
}

// 프로젝트 삭제
export async function deleteProject(projectId: string, userId: string) {
  try {
    const projectRef = ref(database, `projects/${projectId}`);
    const snapshot = await get(projectRef);
    
    if (!snapshot.exists()) {
      throw new Error('Project not found');
    }

    const projectData = snapshot.val();
    if (projectData.userId !== userId) {
      throw new Error('Unauthorized to delete this project');
    }

    await remove(projectRef);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error instanceof Error ? error : new Error('Failed to delete project');
  }
}

// 프로젝트 업데이트
export async function updateProject(
  projectId: string, 
  userId: string, 
  updates: { customDescription?: string }
) {
  try {
    const projectRef = ref(database, `projects/${projectId}`);
    const snapshot = await get(projectRef);
    
    if (!snapshot.exists()) {
      throw new Error('Project not found');
    }

    const projectData = snapshot.val();
    if (projectData.userId !== userId) {
      throw new Error('Unauthorized to update this project');
    }

    const updatedData = {
      ...projectData,
      ...updates,
      updatedAt: Date.now()
    };

    await push(projectRef, updatedData);
    return {
      id: projectId,
      ...updatedData
    };
  } catch (error) {
    console.error('Error updating project:', error);
    throw error instanceof Error ? error : new Error('Failed to update project');
  }
}

// GitHub 저장소 정보 새로고침
export async function refreshProjectInfo(projectId: string, userId: string) {
  try {
    const projectRef = ref(database, `projects/${projectId}`);
    const snapshot = await get(projectRef);
    
    if (!snapshot.exists()) {
      throw new Error('Project not found');
    }

    const projectData = snapshot.val();
    if (projectData.userId !== userId) {
      throw new Error('Unauthorized to refresh this project');
    }

    // GitHub API에서 최신 정보 가져오기
    const repoInfo = await fetchRepoInfo(projectData.repoUrl);
    
    const updatedData = {
      ...projectData,
      repoInfo,
      updatedAt: Date.now()
    };

    await push(projectRef, updatedData);
    return {
      id: projectId,
      ...updatedData
    };
  } catch (error) {
    console.error('Error refreshing project info:', error);
    throw error instanceof Error ? error : new Error('Failed to refresh project info');
  }
}