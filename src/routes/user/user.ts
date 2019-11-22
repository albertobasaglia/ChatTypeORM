import * as Express from "express";
import { getManager } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Message } from "../../entity/Message";
import { User } from "../../entity/User";
export const userRouter = Express.Router();
userRouter.get('/getAllChats', async (req, res) => {
        getManager().getRepository(Chat)
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.users','user')
        .getMany().then((chats) => {
                console.log(chats);
                res.status(200).send(chats);
        });
});