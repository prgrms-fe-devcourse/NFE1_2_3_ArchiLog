// firebase/projects.ts
import { getDatabase, ref, set, get, update, remove, push, serverTimestamp, DataSnapshot } from 'firebase/database';
import { getAuth } from "firebase/auth";
import firebaseApp from './firebase';

const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

interface Project {
  id: string;
  projectUrl: string;
  name: string;
  description: string;
  authorId: string;
  createdAt: number;
  updatedAt?: number;
  githubUrl?: string;
  technologies?: string[];
}

// 프로젝트 목록 불러오기
export const getProjects = async (authorId: string): Promise<Project[]> => {
  const projectsRef = ref(db, `projects/author/${authorId}`);

  try {
    const snapshot = await get(projectsRef);
    const projects: Project[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot: DataSnapshot) => {
        const projectData = childSnapshot.val();
        if (projectData.authorId === authorId) {
          projects.push({
            id: childSnapshot.key!,
            ...projectData,
          });
        }
      });
    }

    return projects.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching projects: ", error);
    throw error;
  }
};

// 프로젝트 추가
export const addProject = async (projectData: Omit<Project, 'id' | 'authorId' | 'createdAt'>) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const projectsRef = ref(db, `projects/author/${user.uid}`);

  try {
    const timestamp = Date.now();
    const newProjectRef = await push(projectsRef, {
      ...projectData,
      authorId: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return {
      id: newProjectRef.key!,
      ...projectData,
      authorId: user.uid,
      createdAt: timestamp,
    };
  } catch (error) {
    console.error("Error adding project: ", error);
    throw error;
  }
};

// 프로젝트 삭제
export const deleteProject = async (projectId: string) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const projectRef = ref(db, `projects/author/${user.uid}/${projectId}`);

  try {
    const snapshot = await get(projectRef);
    if (!snapshot.exists()) {
      throw new Error("Project not found");
    }

    const projectData = snapshot.val();
    if (projectData.authorId !== user.uid) {
      throw new Error("Unauthorized access");
    }

    await remove(projectRef);
    return true;
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};
