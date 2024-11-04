type Post = {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    createdAt?: string;
    updatedAt: string,
    comments?: Comment[];
    authorId: string;
    thumbnail?: string;
}

export default Post;
  