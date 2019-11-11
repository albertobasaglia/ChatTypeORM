import * as Express from "express";
import {userRouter} from "./user/user";
export const router = Express.Router();
router.use('/user',userRouter);