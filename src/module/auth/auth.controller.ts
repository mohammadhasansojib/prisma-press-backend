import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import authService from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/error";


const login = catchAsync(async (req: Request, res: Response) => {
    const {accessToken, refreshToken} = await authService.loginUser(req.body);

    // cookie setting
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 60 * 60 * 24,
    });
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 60 * 60 * 24 * 7,
    });

    sendResponse(res, {
        success: true,
        message: "login successful",
        statusCode: httpStatus.OK,
        data: {
            accessToken,
            refreshToken,
        },
    });
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token;
    if (typeof refreshToken !== "string" || refreshToken.trim() === "") {
        throw new AppError("refresh token not found", httpStatus.UNAUTHORIZED);
    }

    const newAccessToken = await authService.refreshToken(refreshToken);

    res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 60 * 60 * 24,
    });

    sendResponse(res, {
        success: true,
        message: "token refreshed successfully",
        statusCode: httpStatus.OK,
        data: {
            newAccessToken,
        }
    })
})


const authController = {
    login,
    refreshToken,
}
export default authController;