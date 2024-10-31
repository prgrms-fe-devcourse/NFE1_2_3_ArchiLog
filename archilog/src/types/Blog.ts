export default interface Post {
    id: string;
    title: string;
    content: string;
    tags: string[];
    authorId: string;
    createdAt: number;
    updatedAt: number;
  }