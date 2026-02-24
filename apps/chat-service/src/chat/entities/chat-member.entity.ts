import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ChatEntity } from './chat.entity';

@Unique(['chatId', 'userId'])
@Entity()
export class ChatMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  chatId: string;

  @Column()
  userId: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.members, { onDelete: 'CASCADE' })
  chat: ChatEntity;

  @CreateDateColumn()
  joinedAt: Date;
}
