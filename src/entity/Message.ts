import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinTable, Column } from "typeorm";
import { Chat } from "./Chat";
import { User } from "./User";

@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;   
    
    @Column({default: ''})
    text: string;

    @Column()
    sentTime: Date;

    @ManyToOne(type => Chat, chat => chat.messages)
    chat: Chat;

    @ManyToOne(type => User)
    writtenBy: User;

    @ManyToOne(type => Message, {nullable: true})
    replyTo: Message;
}