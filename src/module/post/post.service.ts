import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/error";
import httpStatus from "http-status"



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
    const transactionPost = await prisma.$transaction(async (tx) => {
        const post = await tx.post.findUnique({
            where: {
                id,
            }
        });
        if (!post) {
            throw new AppError("no post found", 404);
        }

        const updatedPost = await tx.post.update({
            where: {
                id,
            },
            data: {
                views: {
                    increment: 1,
                }
            }
        });

        return updatedPost;
    })


    if (!transactionPost) {
        throw new AppError("no post found", httpStatus.NOT_FOUND);
    }

    return transactionPost;
}



const getMyPostsFromDB = async (authorId: string,) => {
    const posts = await prisma.post.findMany({
        where: {
            authorId,
        }
    });
    
    return posts;
}



const updatePostIntoDB = async (
    authorId: string,
    postId: string,
    payload: IUpdatePostPayload,
) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        }
    });
    if (!post) {
        throw new AppError("no post found with this post id", httpStatus.BAD_REQUEST);
    }
    if (post.authorId !== authorId) {
        throw new AppError("you are not permitted to update this resource", httpStatus.FORBIDDEN);
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId,
        },
        data: {
            ...payload,
        },
    });

    return updatedPost;
}

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