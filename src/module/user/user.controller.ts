import type { Request, Response } from "express";
import httpStatus from "http-status";
import userService from "./user.service";



const register = async (req: Request, res: Response) => {
    try {
        const {name, email, password, profilePhoto} = req.body;

        const user = await userService.createUserIntoDB({
            name,
            email,
            password,
            profilePhoto,
        });

        res.status(httpStatus.CREATED).json({
            success: true,
            message: "user created successfully",
            data: {
                user,
            },
            statusCode: httpStatus.CREATED,
        })

        
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



export default {
    register,
}