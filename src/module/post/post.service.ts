import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";



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

const getPostByIdFromDB = async (id: string) => {
    const post = await prisma.post.findUnique({
        where: {
            id,
        }
    });
    if (!post) {
        throw new AppError("no post found", httpStatus.NOT_FOUND);
    }

    return post;
}


const postService = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostByIdFromDB,
}
export default postService;