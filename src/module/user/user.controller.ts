import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, profilePhoto, role} = req.body;

    const user = await userService.createUserIntoDB({
        name,
        email,
        password,
        profilePhoto,
        role,
    });

    sendResponse(res, {
        success: true,
        message: "user created successfully",
        data: {
            user,
        },
        statusCode: httpStatus.CREATED,
    });
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.userId;
    const user = await userService.getMeFromDB(id);

    sendResponse(res, {
        success: true,
        message: "get profile successfully",
        statusCode: httpStatus.OK,
        data: {user},
    })
})



export default {
    register,
    getMyProfile,
}