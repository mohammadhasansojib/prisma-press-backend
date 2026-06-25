import { Response } from "express";
import { TResponseData } from "../module/user/user.interface";


export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message || "internal server error",
        statusCode: data.statusCode || 500,
        data: data.data,
        meta: data.meta,
    })
}