import { getDatabase,  ref, set, get, update, remove, push, serverTimestamp, DataSnapshot } from 'firebase/database';
import { getAuth } from "firebase/auth"; 

// 프로젝트 목록 불러오기
export const getProjects = async (authorId: string) => {
    const db = getDatabase();
    const projectsRef = ref(db, `projects/author/${authorId}`);
  
    try {
      const snapshot = await get(projectsRef);
      const projects: any[] = [];
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot: DataSnapshot) => {
          const projectData = childSnapshot.val();
          if (projectData.authorId === authorId) {
            projects.push({
              id: childSnapshot.key,
              ...projectData,
            });
          }
        });
      }
  
      return projects;
    } catch (error) {
      console.error("Error fetching projects: ", error);
      throw error;
    }
};

export const addProject = async (projectUrl: string) => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error("User not authenticated");
    }
  
    const projectsRef = ref(db, `projects`);
  
    try {
      const newProjectRef = await push(projectsRef, {
        projectUrl: projectUrl,
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });
  
      console.log(`Project added successfully with ID: ${newProjectRef.key}`);
      return {
        projectId: newProjectRef.key,
        projectUrl: projectUrl,
      };
    } catch (error) {
      console.error("Error adding project: ", error);
      throw error;
    }
};

export const deleteProject = async (projectId: string) => {
    const db = getDatabase();
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      throw new Error("User not authenticated");
    }
  
    const projectRef = ref(db, `projects/${projectId}`);
  
    try {
      const projectSnap = await get(projectRef);
      if (!projectSnap.exists()) {
        throw new Error("Project not found");
      }
  
      const projectData = projectSnap.val();
  
      if (projectData.authorId !== user.uid) {
        throw new Error("You do not have permission to delete this project");
      }
  
      await remove(projectRef);
  
      console.log(`Project with ID: ${projectId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting project: ", error);
      throw error;
    }
};