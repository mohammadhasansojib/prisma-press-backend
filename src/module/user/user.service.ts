import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import httpStatus from "http-status";
import { AppError } from "../../utils/error";
import { Role } from "../../../generated/prisma/enums";


const createUserIntoDB = async (payload: {
    name: string,
    email: string,
    password: string,
    profilePhoto: string,
    role?: Role
}) => {
    const {name, email, password, profilePhoto, role} = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if (isUserExist) {
        const error = new AppError("user with this email already exists", httpStatus.CONFLICT);

        throw error;
    }

    const hashPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
            role,
            profile: {
                create: {
                    profilePhoto,
                }
            }
        },
        include: {
            profile: true,
        },
        omit: {
            password: true,
        }
    });

    return createdUser;
}

const getMeFromDB = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            profile: true,
        },
        omit: {
            password: true,
        }
    });
    if (!user) {
        throw new AppError("user not found", httpStatus.NOT_FOUND);
    }

    return user;
}


const userService = {
    createUserIntoDB,
    getMeFromDB,
}

export default userService;