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
        config.jwt_access_secret,
        {
            expiresIn: config.jwt_access_expires_in,
        }
    );

    return {
        accessToken,
        refreshToken,
    }
}


const authService = {
    loginUser,
}
export default authService;