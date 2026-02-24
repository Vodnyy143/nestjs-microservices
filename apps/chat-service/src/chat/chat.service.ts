import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatEntity } from './entities/chat.entity';
import { MessageEntity } from './entities/message.entity';
import { ChatMemberEntity } from './entities/chat-member.entity';
import {
  AddMemberDto,
  CreateChatDto,
  GetChatsDto,
  GetMessagesDto,
  LeaveChatDto,
  SendMessageDto,
} from '@app/shared';
import { RpcException } from '@nestjs/microservices';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatsRepository: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
    @InjectRepository(ChatMemberEntity)
    private readonly membersRepository: Repository<ChatMemberEntity>,

    private readonly chatGatewat: ChatGateway,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    const newChat = this.chatsRepository.create({
      name: createChatDto.name,
      description: createChatDto.description,
      isGroup: createChatDto.isGroup,
      createdBy: createChatDto.createdBy,
    });
    const savedChat = await this.chatsRepository.save(newChat);

    const members = createChatDto.memberIds.map((userId) =>
      this.membersRepository.create({ chatId: savedChat.id, userId }),
    );

    await this.membersRepository.save(members);

    return newChat;
  }

  async getChats(getChatsDto: GetChatsDto) {
    const memberRecords = await this.membersRepository.find({
      where: { userId: getChatsDto.userId },
    });
    const chatIds = memberRecords.map((member) => member.chatId);

    if (chatIds.length === 0) return { items: [], total: 0 };

    const [items, total] = await this.chatsRepository.findAndCount({
      where: chatIds.map((id) => ({ id })),
      order: { updatedAt: 'DESC' },
      take: getChatsDto.limit,
      skip: getChatsDto.offset,
    });

    return { items, total };
  }

  async getChat(id: string) {
    const findChat = await this.chatsRepository.findOne({
      where: { id },
      relations: ['members'],
    });

    if (!findChat) {
      throw new RpcException({ statusCode: 404, message: 'Chat not Found' });
    }

    return findChat;
  }

  async sendMessage(sendMessageDto: SendMessageDto) {
    const isMember = await this.membersRepository.findOne({
      where: { chatId: sendMessageDto.chatId, userId: sendMessageDto.senderId },
    });
    if (!isMember) {
      throw new RpcException({
        statusCode: 403,
        message: 'You are not a member of this chat',
      });
    }

    const newMessage = this.messagesRepository.create({
      chatId: sendMessageDto.chatId,
      senderId: sendMessageDto.senderId,
      content: sendMessageDto.content,
      readBy: [sendMessageDto.senderId],
    });

    const savedMessage = await this.messagesRepository.save(newMessage);

    await this.chatsRepository.update(sendMessageDto.chatId, {
      updatedAt: new Date(),
    });

    this.chatGatewat.broadcastToChat(
      sendMessageDto.chatId,
      'new_message',
      savedMessage,
    );

    return savedMessage;
  }

  async getMessages(getMessagesDto: GetMessagesDto): Promise<{
    items: MessageEntity[];
    total: number;
  }> {
    const qb = this.messagesRepository
      .createQueryBuilder('message')
      .where('message.chatId = :chatId', { chatId: getMessagesDto.chatId })
      .orderBy('message.createdAt', 'DESC')
      .take(getMessagesDto.limit);

    if (getMessagesDto.before) {
      const cursor = await this.messagesRepository.findOne({
        where: { id: getMessagesDto.before },
      });
      if (cursor) {
        qb.andWhere('message.createdAt < :date', { date: cursor.createdAt });
      }
    }

    const [items, total] = await qb.getManyAndCount();

    const toUpdate: MessageEntity[] = [];

    for (const msg of items) {
      if (!msg.readBy) {
        msg.readBy = [];
      }

      if (!msg.readBy.includes(getMessagesDto.userId)) {
        msg.readBy.push(getMessagesDto.userId);
        toUpdate.push(msg);
      }
    }

    if (toUpdate.length > 0) {
      await this.messagesRepository.save(toUpdate);
    }

    return { items: items.reverse(), total };
  }

  async addMember(addMemberDto: AddMemberDto) {
    const existing = await this.membersRepository.findOne({
      where: { chatId: addMemberDto.chatId, userId: addMemberDto.userId },
    });
    if (existing) {
      throw new RpcException({
        statusCode: 409,
        message: 'User is already member',
      });
    }

    const member = this.membersRepository.create({
      chatId: addMemberDto.chatId,
      userId: addMemberDto.userId,
    });

    return this.membersRepository.save(member);
  }

  async leaveChat(leaveChatDto: LeaveChatDto) {
    const result = await this.membersRepository.delete({
      chatId: leaveChatDto.chatId,
      userId: leaveChatDto.userId,
    });

    if (result.affected === 0) {
      throw new RpcException({
        statusCode: 404,
        message: 'Member not found.',
      });
    }

    return { success: true };
  }
}
