import * as Express from "express";
import { getManager, getRepository } from "typeorm";
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
    const chatWithUsers = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["users"]});
    const chat = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["messages"]});
    const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});
    if(chatWithUsers.users.findIndex((user: User) => {return user.id === req.userId}) === -1)  {
        res.status(403).send({msg: 'Non hai i permessi!'});
    } else {
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
    }    
});
chatRouter.get('/:chatId/getAllMessages',async (req,res) => {
    const messageRepository = getManager().getRepository(Message);
    const chatRepository = getManager().getRepository(Chat);
    const chatWithUsers = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["users"]});
    const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});
    if(chatWithUsers.users.findIndex((user: User) => {return user.id === req.userId}) === -1)  {
        res.status(403).send({msg: 'Non hai i permessi!'});
    } else {
        const messages = await messageRepository.createQueryBuilder('message')
            .innerJoin('message.chat','chat')
            .where('chat.id = :chatId',{chatId: req.params.chatId})
            .orderBy('message.sentTime','DESC')
            .getMany();
        res.send(messages);
    }
});
chatRouter.get('/:chatId/getLastMessages', [check('count').isNumeric()], async (req,res) => {
    const messageRepository = getManager().getRepository(Message);
    const chatRepository = getManager().getRepository(Chat);
    const chatWithUsers = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["users"]});
    const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});
    if(chatWithUsers.users.findIndex((user: User) => {return user.id === req.userId}) === -1)  {
        res.status(403).send({msg: 'Non hai i permessi!'});
    } else {
        const messages = await messageRepository.createQueryBuilder('message')
            .innerJoin('message.chat','chat')
            .innerJoin('message.writtenBy','writtenBy')
            .addSelect(['writtenBy.id','writtenBy.username'])
            .where('chat.id = :chatId',{chatId: req.params.chatId})
            .orderBy('message.sentTime','DESC')
            .limit(req.query.count)
            .getMany();
        res.send(messages);
    }
});
// chatRouter.get('/:chatId/getMessagesSince',[check('datetime').isAlphanumeric()], async (req,res) => {
//     const messageRepository = getManager().getRepository(Message);
//     const chatRepository = getManager().getRepository(Chat);
//     const chatWithUsers = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["users"]});
//     const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});
//     if(chatWithUsers.users.findIndex((user: User) => {return user.id === req.userId}) === -1)  {
//         res.status(403).send({msg: 'Non hai i permessi!'});
//     } else {
//         const messages = await messageRepository.createQueryBuilder('message')
//             .innerJoin('message.chat','chat')
//             .where('chat.id = :chatId',{chatId: req.params.chatId})
//             .innerJoin('message.writtenBy','writtenBy')
//             .addSelect(['writtenBy.id','writtenBy.username'])
//             .orderBy('message.sentTime','DESC')
//             .where('message.sentTime >= :datetime',{datetime: new Date(req.query.datetime)})
//             .getMany();
//         res.send(messages);
//     }
// });
chatRouter.get('/:chatId/getMessagesAfter', async (req,res) => {
    const messageRepository = getManager().getRepository(Message);const chatRepository = getManager().getRepository(Chat);
    const chatWithUsers = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["users"]});
    const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});
    if(chatWithUsers.users.findIndex((user: User) => {return user.id === req.userId}) === -1)  {
        res.status(403).send({msg: 'Non hai i permessi!'});
    } else {
        const messages = await messageRepository.createQueryBuilder('message')
            .innerJoin('message.chat','chat')
            .where('chat.id = :chatId',{chatId: req.params.chatId})
            .innerJoin('message.writtenBy','writtenBy')
            .addSelect(['writtenBy.id','writtenBy.username'])
            .orderBy('message.sentTime','DESC')
            .andWhere('message.id > :id',{id: req.query.id})
            .getMany();
        res.send(messages);
    }
});
chatRouter.post('/:chatId/addUser', async (req,res) => {
    const chatRepository = getManager().getRepository(Chat);
    const chat = await chatRepository.findOne({where: {id: req.params.chatId},relations: ["createdBy","users"]});
    // TODO check if admins
    const user = await getManager().getRepository(User).findOne({where: {id: req.userId}});    
    if(chat.createdBy.id != user.id)  {
        res.status(403).send({msg: 'Non hai i permessi!'});
    } else {
        getManager().getRepository(User).findOne({where: {id: req.body.userId}})
        .then((toAdd: User) => {
            if(toAdd == null) {
                res.status(400).send({msg: 'Unknown user!'});
            } else {
                chat.users.push(toAdd);
                chatRepository.save(chat);
                res.status(200).send({msg: 'Ok!'});
            }
        });
    }
});
chatRouter.get('/:chatId/info',async (req,res) => {
    const chatRepository = getManager().getRepository(Chat);
    const chat = await chatRepository.findOne({where: {id: req.params.chatId},relations: ['users']});
    if(chat == null) {
        res.status(400).send({msg: 'Unknown chat!'});
    } else {
        res.status(200).send(chat);
    }
});