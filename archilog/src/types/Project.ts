export interface Project {
    id: string;
    username: string;
    repoUrl: string;
    customDescription: string;
    createdAt: number;
    repoInfo: {
      name: string;
      description: string;
      html_url: string;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      topics?: string[];
      updated_at: string;
    };
  }