type Post = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
  updatedAt: string;
  comments?: string[];
  authorId: string;
  thumbnail?: string;
};

export interface PostFormInputs {
  title: string;
  tags: string;
}

export interface PostFormProps {
  darkMode: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

// 목차 항목
export interface TOCItem {
  id: string;
  text: string | null;
  level: string;
}

export default Post;
