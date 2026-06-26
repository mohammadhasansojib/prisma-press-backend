import express from "express"
import userController from "./user.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();


router.post('/register', userController.register);
router.get('/me', auth(Role.ADMIN, Role.AUTHOR, Role.USER), userController.getMyProfile);
router.put("/my-profile", auth(Role.ADMIN, Role.USER), userController.updateMyProfile);


export default router;