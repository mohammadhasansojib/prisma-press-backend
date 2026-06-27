import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { LoginPayload } from "./auth.interface";
import { AppError } from "../../utils/error";
import httpStatus from "http-status"
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";

const loginUser = async (payload: LoginPayload) => {
    const user = await prisma.user.findUnique({
        where: {email: payload.email},
    });
    if (!user) {
        throw new AppError("email does not exists", httpStatus.BAD_REQUEST);
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatched) {
        throw new AppError("invalid password", httpStatus.UNAUTHORIZED);
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        {
            expiresIn: config.jwt_access_expires_in,
        }
    );
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        {
            expiresIn: config.jwt_access_expires_in,
        }
    );

    return {
        accessToken,
        refreshToken,
    }
}

const refreshToken = async (refreshToken: string) => {
    const decoded = jwtUtils.verifyToken(refreshToken, config.jwt_refresh_secret);
    if (typeof decoded === "string") {
        throw new AppError("invalid refresh token", httpStatus.UNAUTHORIZED);
    }

    const user = await prisma.user.findUnique({
        where: {
            id: decoded.userId,
        }
    })
    if (!user) {
        throw new AppError("no user found against this refresh token", httpStatus.UNAUTHORIZED);
    }
    if (user.activeStatus === "BLOCKED") {
        throw new AppError("your account has been blocked, can't access the resource", httpStatus.FORBIDDEN);
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        {
            expiresIn: config.jwt_access_expires_in
        }
    );

    return accessToken;
}


const authService = {
    loginUser,
    refreshToken,
}
export default authService;