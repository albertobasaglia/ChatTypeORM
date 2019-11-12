import * as Express from "express";
import { getManager } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Message } from "../../entity/Message";
import { check, validationResult } from "express-validator";
import { User } from "../../entity/User";
export const chatRouter = Express.Router();
chatRouter.post('/create', [check('name').isLength({max: 25, min: 5})] ,async (req: Express.Request,res: Express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).send({ errors });
    } else {
        const userRepository = getManager().getRepository(User);
        const chatRepository = getManager().getRepository(Chat);
        const newChat = new Chat();
        newChat.name = req.body.name;
        const creator = await userRepository.findOne({where: {id: req.userId}});
        newChat.createdBy = creator;
        newChat.users = [];
        newChat.users.push(creator);
        const createdChat = await chatRepository.save(newChat);
        res.status(200).send({id: createdChat.id});
    }
});
chatRouter.post('/:chatId/sendMessage',[check('text').isLength({min:1,max:1024})],async (req: Express.Request,res: Express.Response) => {
    const chatRepository = getManager().getRepository(Chat);
    const chat = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["messages"]});
    const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});
    const message = new Message();
    message.writtenBy = user;
    message.text = req.body.text;
    message.sentTime = new Date();
    if(!chat.messages) {
        chat.messages = [];
    }
    chat.messages.push(message);
    const savedChat = await chatRepository.save(chat);
    res.status(200).send({id: message.id});
});
