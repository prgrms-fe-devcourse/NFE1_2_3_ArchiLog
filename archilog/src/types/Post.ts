type Post = {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    createdAt?: string;
    updatedAt: string,
    comments?: string[];
    authorId: string;
}

export default Post;
  