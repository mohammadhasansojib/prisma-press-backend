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


const postService = {
    createPostIntoDB,
}
export default postService;