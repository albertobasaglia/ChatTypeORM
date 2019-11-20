import "reflect-metadata";
import { createConnection, getManager, getConnectionOptions } from "typeorm";
import { User } from "./entity/User";
import * as Express from "express";
import { router } from "./routes/router";
import * as net from "net";
import * as bodyParser from "body-parser";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();
getConnectionOptions().then((connectionOptions) => {
    Object.assign(connectionOptions, { 
        database: process.env.TYPEORM_DATABASE,
        username: process.env.TYPEORM_USERNAME,
        port: process.env.TYPEORM_PORT,
        password: process.env.TYPEORM_PASSWORD,
        host: process.env.TYPEORM_HOST});
    createConnection(connectionOptions).then(async connection => {
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
        }).listen(process.env.SOCKET_PORT);
        app.listen(process.env.HTTP_PORT, () => {
            console.log(`Server started on port ${process.env.HTTP_PORT}`);
        });
    }).catch(error => console.log(error));
});