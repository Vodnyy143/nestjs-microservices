import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  AddMemberDto,
  CHAT_PATTERNS,
  CreateChatDto,
  GetChatsDto,
  GetMessagesDto,
  LeaveChatDto,
  SendMessageDto,
} from '@app/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { id } from 'zod/v4/locales';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @MessagePattern(CHAT_PATTERNS.CREATE_CHAT)
  createChat(@Payload() dto: CreateChatDto) {
    return this.chatService.createChat(dto);
  }

  @MessagePattern(CHAT_PATTERNS.GET_CHATS)
  getChats(@Payload() dto: GetChatsDto) {
    return this.chatService.getChats(dto);
  }

  @MessagePattern(CHAT_PATTERNS.GET_CHAT)
  getChat(@Payload() payload: { id: string }) {
    return this.chatService.getChat(payload.id);
  }

  @MessagePattern(CHAT_PATTERNS.SEND_MESSAGE)
  sendMessage(@Payload() dto: SendMessageDto) {
    return this.chatService.sendMessage(dto);
  }

  @MessagePattern(CHAT_PATTERNS.GET_MESSAGES)
  getMessages(@Payload() dto: GetMessagesDto) {
    return this.chatService.getMessages(dto);
  }

  @MessagePattern(CHAT_PATTERNS.ADD_MEMBER)
  addMember(@Payload() dto: AddMemberDto) {
    return this.chatService.addMember(dto);
  }

  @MessagePattern(CHAT_PATTERNS.LEAVE_CHAT)
  leaveChat(@Payload() dto: LeaveChatDto) {
    return this.chatService.leaveChat(dto);
  }
}
