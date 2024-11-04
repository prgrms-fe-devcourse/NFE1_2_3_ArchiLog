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

export default Post;
