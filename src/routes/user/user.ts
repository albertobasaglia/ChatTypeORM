import * as Express from "express";
import { getManager } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Message } from "../../entity/Message";
export const userRouter = Express.Router();
userRouter.get('/getAllChats', (req, res) => {
    getManager().getRepository(Chat)
        .find({where: {createdBy: req.userId}}).then((chats: Chat[]) => {
                res.status(200).send(chats);
        });
});