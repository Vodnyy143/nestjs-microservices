import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatMemberEntity } from './chat-member.entity';
import { MessageEntity } from './message.entity';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, length: 500 })
  description?: string | null;

  @Column({ default: false })
  isGroup: boolean;

  @Column()
  createdBy: string;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  messages: MessageEntity[];

  @OneToMany(() => ChatMemberEntity, (member) => member.chat)
  members: ChatMemberEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
