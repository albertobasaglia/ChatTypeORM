import * as Express from "express";
import {userRouter} from "./user/user";
import {authRouter} from "./auth";
import { Request, Response } from "express-serve-static-core";
import { NextFunction } from "connect";
import * as jsonwebtoken from "jsonwebtoken";
import { chatRouter } from "./chat/chat";
export const router = Express.Router();
router.use((req,res,next) => {
    console.log(req.url);
    next();
})
router.use('/auth',authRouter);
router.use((req: Request,res: Response, next: NextFunction) => {
    jsonwebtoken.verify(req.headers.authorization,process.env.JWT_SECRET,(err: jsonwebtoken.JsonWebTokenError,decoded: {id: number, email: string}) => {
        if(err) {
            res.status(403).send({msg: 'Token non valido!'});
        } else {
            req.userId = decoded.id;
            req.userEmail = decoded.email;            
            next();
        }
    });
});
router.use('/user',userRouter);
router.use('/chat',chatRouter);