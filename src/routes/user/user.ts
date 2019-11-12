import * as Express from "express";
import { getManager } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Message } from "../../entity/Message";
export const userRouter = Express.Router();
// userRouter.get('/list',(req,res) => {
//     getManager().getRepository(Chat).find({relations: ['messages']}).then((chats: Chat[]) => {
//         res.send(chats);
//     });
// });