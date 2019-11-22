import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Chat } from "./Chat";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({select: false})
    passwordHash: string;

    @Column()
    email: string;

    @ManyToMany(type => Chat, chat => chat.users)
    chats: Chat[];

    @Column({default: false,select: false})
    confirmed: boolean;

    @Column({nullable: true,select: false})
    confirmCode: string;
}
