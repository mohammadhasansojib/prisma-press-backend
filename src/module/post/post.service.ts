import { prisma } from "../../lib/prisma";
import { ICreatePostPayload } from "./post.interface";



const createPostIntoDB = async (
    payload: ICreatePostPayload,
    authorId: string,
) => {
    const createdPost = await prisma.post.create({
        data: {
            ...payload,
            authorId,
        },
    });

    return createdPost;
}

const getAllPostsFromDB = async () => {
    const posts = await prisma.post.findMany();

    return posts;
}


const postService = {
    createPostIntoDB,
    getAllPostsFromDB,
}
export default postService;