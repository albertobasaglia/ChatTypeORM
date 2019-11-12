import * as Express from "express";
import {userRouter} from "./user/user";
import {authRouter} from "./auth";
export const router = Express.Router();
router.use('/user',userRouter);
router.use('/auth',authRouter);