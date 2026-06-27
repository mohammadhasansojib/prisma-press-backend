import cookieParser from "cookie-parser";
import cors from "cors"
import express from "express"
import type { Request, Response } from "express";
import config from "./config";
import userRouter from "./module/user/user.route"
import authRouter from "./module/auth/auth.route";
import postRouter from "./module/post/post.route";

const app = express();

// middlewares
app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// api routes
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Server running..."
    })
})

export default app;