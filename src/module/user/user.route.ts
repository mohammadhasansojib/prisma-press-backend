import express from "express"
import userController from "./user.controller";

const router = express.Router();


router.post('/register', userController.register);


export default router;