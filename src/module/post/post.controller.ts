import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import postService from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"


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


const postController = {
    createPost,
    getAllPosts,
}
export default postController;