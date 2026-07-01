import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import postService from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
import { AppError } from "../../utils/error";
import { Role } from "../../../generated/prisma/enums";


const createPost = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const payload = req.body;

    const createdPost = await postService.createPostIntoDB(
        payload,
        userId,
    );

    sendResponse(res, {
        success: true,
        message: "post created successfully",
        statusCode: httpStatus.CREATED,
        data: {
            post: createdPost,
        }
    })
})

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const posts = await postService.getAllPostsFromDB();

    sendResponse(res, {
        success: true,
        message: "get all posts successfully",
        statusCode: httpStatus.OK,
        data: {
            posts,
        }
    })
})

const getSinglePostById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.postId;
    if (typeof id !== "string" || id.trim() === "") {
        throw new AppError("invalid post id", httpStatus.BAD_REQUEST);
    }

    const post = await postService.getPostByIdFromDB(id);

    sendResponse(res, {
        success: true,
        message: "post retrived successfully",
        statusCode: httpStatus.OK,
        data: {
            post,
        }
    })
})

const getMyPosts = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user?.userId;
    if (typeof authorId !== "string" || authorId.trim() === "") {
        throw new AppError("invalid author id", httpStatus.BAD_REQUEST);
    }

    const posts = await postService.getMyPostsFromDB(authorId);

    sendResponse(res, {
        success: true,
        message: "posts retrived successfully",
        statusCode: httpStatus.OK,
        data: {
            posts,
        }
    })
})

const updatePost = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user?.userId;
    const postId = req.params.postId;
    const payload = req.body;

    if (typeof postId !== "string" || postId.trim() === "") {
        throw new AppError("invalid post id", httpStatus.BAD_REQUEST);
    }
    if (typeof authorId !== "string" || authorId.trim() === "") {
        throw new AppError("invalid author id", httpStatus.BAD_REQUEST);
    }

    const updatedPost = await postService.updatePostIntoDB(
        authorId,
        postId,
        payload,
    );

    sendResponse(res, {
        success: true,
        message: "post updated successfully",
        statusCode: httpStatus.OK,
        data: {
            updatedPost,
        }
    })
})

const deletePost = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user?.userId;
    const role = req.user?.role;
    const postId = req.params.postId;

    if (typeof authorId !== "string" || authorId.trim() === "") {
        throw new AppError("invalid author id", httpStatus.BAD_REQUEST);
    }
    if (typeof postId !== "string" || postId.trim() === "") {
        throw new AppError("invalid post id", httpStatus.BAD_REQUEST);
    }
    if (![Role.ADMIN, Role.AUTHOR, Role.USER].includes(role)) {
        throw new AppError("invalid user role", httpStatus.BAD_REQUEST);
    }

    await postService.deletePostFromDB(
        postId,
        authorId,
        role,
    );

    sendResponse(res, {
        success: true,
        message: "post deleted successfully",
        statusCode: httpStatus.OK,
        data: {},
    })
})

const getPostStats = catchAsync(async (req: Request, res: Response) => {
    const postStats = await postService.getPostStatsFromDB();

    sendResponse(res, {
        success: true,
        message: "post stats retrived successfully",
        statusCode: httpStatus.OK,
        data: {
            postStats,
        }
    })
})


const postController = {
    createPost,
    getAllPosts,
    getSinglePostById,
    getMyPosts,
    updatePost,
    deletePost,
    getPostStats,
}
export default postController;