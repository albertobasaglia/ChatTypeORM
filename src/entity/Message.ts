import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, Column } from "typeorm";
import { Chat } from "./Chat";
import { User } from "./User";

@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;   
    
    @Column()
    text: string;

    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat;

    @ManyToOne(type => User, {eager: true})
    writtenBy: User;

    @ManyToOne(type => Message, {nullable: true})
    replyTo: Message;
}