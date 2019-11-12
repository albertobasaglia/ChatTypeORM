import "reflect-metadata";
import { createConnection, getManager } from "typeorm";
import { User } from "./entity/User";
import * as Express from "express";
import { router } from "./routes/router";
import * as net from "net";
import * as jsonwebtoken from "jsonwebtoken";
import * as bodyParser from "body-parser";
import { Chat } from "./entity/Chat";
import { Message } from "./entity/Message";
createConnection().then(async connection => {

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    // const users = await connection.manager.find(User);
    // console.log("Loaded users: ", users);

    // console.log("Here you can setup and run express/koa/any other framework.");
    // const user = new User();
    // user.firstName = "Timber";
    // user.lastName = "Saw";
    // user.age = 25;
    // connection.manager.save(user).then((saved: User) => {
    //     console.log(saved);
    // });

    const app = Express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/', router);
    net.createServer((sock: net.Socket) => {
        sock.on('data', (data: Buffer) => {
            sock.write(data);
        });
        sock.on('close', () => {
            console.log('Socket closed!');
        });
        connection.manager.find(User).then((users: User[]) => {
            users.forEach((user: User) => {
                sock.write(JSON.stringify(user));
            });
        });
    }).listen(1338);
    app.listen(1337, () => {
        console.log('Server started!');
    });



    // const chat = new Chat();
    // chat.messages = [];
    // const msg1 = new Message();
    // msg1.text = 'text1';
    // const msg2 = new Message();
    // msg2.text = 'text2';
    // chat.messages.push(msg1,msg2);
    // console.log(chat);
    // getManager().getRepository(Chat).save(chat);



}).catch(error => console.log(error));
