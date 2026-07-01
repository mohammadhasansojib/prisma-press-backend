import express from "express"
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import postController from "./post.controller";

const router = express.Router();

router.get('/', postController.getAllPosts)
router.get('/stats', auth(Role.ADMIN), postController.getPostStats)
router.get('/my-posts', auth(Role.ADMIN, Role.USER), postController.getMyPosts)
router.get('/:postId', postController.getSinglePostById)

router.post('/', auth(Role.ADMIN, Role.USER), postController.createPost)

router.patch('/:postId', auth(Role.ADMIN, Role.USER), postController.updatePost)

router.delete('/:postId', auth(Role.ADMIN, Role.USER), postController.deletePost)


const postRouter = router;
export default postRouter;