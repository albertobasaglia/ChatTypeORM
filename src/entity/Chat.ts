import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Message } from "./Message";
import { User } from "./User";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToMany(type => Message, messages => messages.chat, {cascade: true})
    messages: Message[];

    @ManyToOne(type => User)
    createdBy: User;

    @ManyToMany(type => User, user => user.chats)
    @JoinTable()
    users: User[];
}