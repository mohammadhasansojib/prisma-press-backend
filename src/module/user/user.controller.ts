import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import userService from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password, profilePhoto} = req.body;

    const user = await userService.createUserIntoDB({
        name,
        email,
        password,
        profilePhoto,
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



export default {
    register,
}