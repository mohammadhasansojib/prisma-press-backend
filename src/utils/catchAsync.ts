import type { NextFunction, Request, RequestHandler, Response } from "express";
import { sendResponse } from "./sendResponse";
import httpStatus from "http-status";


export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            await fn(req, res, next);

        } catch (error: any) {
            console.log(error);

            const statusCode = error.statusCode || 500;

            if (error.name === "JsonWebTokenError") {

                sendResponse(res, {
                    success: false,
                    message: error.message,
                    statusCode: httpStatus.UNAUTHORIZED,
                    data: {error}
                });

            } else {

                sendResponse(res, {
                    success: false,
                    message: error.message || "Internal server error",
                    statusCode: statusCode,
                    data: {error}
                });

            }
        }
    }
}