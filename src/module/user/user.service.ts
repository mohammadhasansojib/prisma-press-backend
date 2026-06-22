import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import httpStatus from "http-status";

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
  }
}


const createUserIntoDB = async (payload: {
    name: string,
    email: string,
    password: string,
    profilePhoto: string,
}) => {
    const {name, email, password, profilePhoto} = payload;

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


const userService = {
    createUserIntoDB,
}

export default userService;