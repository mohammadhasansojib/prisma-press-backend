import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { JwtPayload } from "jsonwebtoken"
import config from "../config";
import { Role } from "../../generated/prisma/enums";
import httpStatus from "http-status"
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { jwtUtils } from "../utils/jwt";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload,
        }
    }
}


const auth = (...roles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.access_token ? 
                    req.cookies.access_token
                    : req.headers.authorization?.startsWith("Bearer")
                    ? req.headers.authorization?.split(" ")[1]
                    : req.headers.authorization;
        if (!token) {
            throw new AppError("token not found", httpStatus.UNAUTHORIZED);
        }

        const decoded = jwtUtils.verifyToken(
            token,
            config.jwt_access_secret,
        ) as JwtPayload;
        if (!roles.includes(decoded.role)) {
            throw new AppError("you are not permitted to access this resource!", httpStatus.FORBIDDEN);
        }

        const fetchedUser = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
            }
        });
        if (!fetchedUser) {
            throw new AppError("unregistered user", httpStatus.NOT_FOUND);
        }
        if (fetchedUser.activeStatus === "BLOCKED") {
            throw new AppError("you account has been blocked", httpStatus.FORBIDDEN);
        }

        req.user = decoded;

        next();
    })
}


export default auth;