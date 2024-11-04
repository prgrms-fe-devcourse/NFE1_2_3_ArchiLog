type Post = {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: string;
  updatedAt: string;
  comments?: Comment[];
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

// 목차 항목
export interface TOCItem {
  id: string;
  text: string | null;
  level: string;
}

export default Post;
