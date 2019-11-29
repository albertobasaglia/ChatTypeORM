import * as Express from "express";
import { getManager } from "typeorm";
import { Chat } from "../../entity/Chat";
import { Message } from "../../entity/Message";
import { User } from "../../entity/User";
export const userRouter = Express.Router();
userRouter.get('/getAllChats', async (req, res) => {
        getManager().getRepository(Chat)
                .createQueryBuilder('chat')
                .leftJoin('chat.users', 'user')
                .select('chat.id','id')
                .addSelect('chat.name','name')
                .where('user.id = :userId',{userId: req.userId})
                .getRawMany().then((chats) => {
                        console.log(chats);
                        res.status(200).send(chats);
                });
});
userRouter.get('/info', async (req, res) => {
        getManager().getRepository(User)
                .createQueryBuilder('user')
                .addSelect('user.phoneNumber')
                .addSelect('user.confirmed')
                .where('user.id = :userId', { userId: req.userId })
                .getOne().then((user: User) => {
                        console.log(user);
                        res.status(200).send(user);
                });
});
//TODO add validators
userRouter.post('/info', async (req, res) => {
        getManager()
                .createQueryBuilder()
                .update(User)
                .set({
                        'username': req.body.username,
                        'phoneNumber': req.body.phoneNumber
                })
                .where('id = :userId',{userId: req.userId})
                .execute()
                .then(() => {
                        res.status(200).send({});
                })
});
userRouter.get('/users', async (req,res) => {
        getManager()
        .createQueryBuilder(User,'user')
        .where('(user.username LIKE :query OR user.email LIKE :query) AND user.id <> :userId',{'query':'%'+req.query.query+'%','userId':req.userId})
        .limit(50)
        .getMany()
        .then((users: User[]) => {
                res.send(users);
        });
});