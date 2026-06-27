import express from "express"
import authController from "./auth.controller";

const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

const authRouter = router;
export default authRouter;