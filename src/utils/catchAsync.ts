import type { NextFunction, Request, RequestHandler, Response } from "express";



export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {

            await fn(req, res, next);

        } catch (error: any) {
            console.log(error);

            res.status(error.statusCode).json({
                success: false,
                data: {
                    error,
                },
                message: error.message,
                statusCode: error.statusCode,
            })
        }
    }
}