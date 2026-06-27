import express from "express"
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import postController from "./post.controller";

const router = express.Router();

router.post('/', auth(Role.ADMIN, Role.USER), postController.createPost)

const postRouter = router;
export default postRouter;