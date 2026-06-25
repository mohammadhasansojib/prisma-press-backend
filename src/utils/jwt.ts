import jwt, { SignOptions } from "jsonwebtoken"
import { Role } from "../../generated/prisma/enums";

interface IJWTPayload {
    userId: string,
    name: string,
    email: string,
    role: Role,
}

const createToken = (
    jwtPayload: IJWTPayload,
    jwtSecret: string,
    jwtOptions: {
        expiresIn: string
    },
) => {
    const token = jwt.sign(
        jwtPayload,
        jwtSecret,
        jwtOptions as SignOptions,
    );

    return token;
}




export const jwtUtils = {
    createToken,
}