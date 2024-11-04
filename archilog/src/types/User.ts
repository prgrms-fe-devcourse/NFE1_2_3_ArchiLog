import Post  from './Post';

type User = {
    username: string,
    email: string,
    createdAt: string,
    userId: string,
    resume: string,
    project: [],
    posts: Post []
}

export default User;