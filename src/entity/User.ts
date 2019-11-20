import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { Chat } from "./Chat";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    passwordHash: string;

    @Column()
    email: string;

    @ManyToMany(type => Chat, chat => chat.users)
    chats: Chat[];

    @Column({default: false})
    confirmed: boolean;

    @Column({nullable: true})
    confirmCode: string;
}
