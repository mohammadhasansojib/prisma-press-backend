import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";
import { AppError } from "../../utils/error";
import httpStatus from "http-status"
import { CommentStatus, PostStatus, Role } from "../../../generated/prisma/enums";



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



const deletePostFromDB = async (postId: string, authorId: string, role: Role) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        }
    });
    if (!post) {
        throw new AppError("no post found to delete", httpStatus.BAD_REQUEST);
    }
    if (post.authorId !== authorId && role !== Role.ADMIN) {
        throw new AppError("you are not permitted to delete this resource", httpStatus.FORBIDDEN);
    }

    await prisma.post.delete({
        where: {
            id: postId,
        }
    });

    return null;
}



const getPostStatsFromDB = async () => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        const [
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalPostViewsAggregate,
        ] = await Promise.all([
            tx.post.count(),
            tx.post.count({
                where: {
                    status: PostStatus.PUBLISHED,
                }
            }),
            tx.post.count({
                where: {
                    status: PostStatus.DRAFT,
                }
            }),
            tx.post.count({
                where: {
                    status: PostStatus.ARCHIVED,
                }
            }),
            tx.comment.count(),
            tx.comment.count({
                where: {
                    status: CommentStatus.APPROVED,
                }
            }),
            tx.comment.count({
                where: {
                    status: CommentStatus.REJECTED,
                }
            }),

            tx.post.aggregate({
                _sum: {
                    views: true,
                }
            }),
        ]);

        return {
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalPostViews: totalPostViewsAggregate._sum.views,
        }
        
    });

    return transactionResult;
}


const postService = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostByIdFromDB,
    getMyPostsFromDB,
    updatePostIntoDB,
    deletePostFromDB,
    getPostStatsFromDB,
}
export default postService;