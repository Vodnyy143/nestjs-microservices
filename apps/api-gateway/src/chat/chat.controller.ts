import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CHAT_PATTERNS,
  CreateChatDto,
  CreateChatSchema,
  GetMessagesDto,
  SendMessageDto,
  SendMessageSchema,
  TokenPayload,
} from '@app/shared';
import { ZodValidationPipe } from 'nestjs-zod';
import { CurrentUser } from '../decorators/current-user.decorator';
import { firstValueFrom } from 'rxjs';

@Controller('chat')
export class ChatController {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  @Post()
  createChat(
    @Body(new ZodValidationPipe(CreateChatSchema)) dto: CreateChatDto,
    @CurrentUser() user: TokenPayload,
  ) {
    const memberIds = Array.from(new Set([user.userId, ...dto.memberIds]));
    return firstValueFrom(
      this.chatClient.send(CHAT_PATTERNS.CREATE_CHAT, {
        ...dto,
        memberIds,
        createdBy: user.userId,
      }),
    );
  }

  @Get()
  getChats(@CurrentUser() user: TokenPayload) {
    return firstValueFrom(
      this.chatClient.send(CHAT_PATTERNS.GET_CHATS, {
        userId: user.userId,
      }),
    );
  }

  @Get(':id')
  getChat(@Param('id') id: string) {
    return firstValueFrom(this.chatClient.send(CHAT_PATTERNS.GET_CHAT, { id }));
  }

  @Get(':id/messages')
  getMessages(
    @Param('id') chatId: string,
    @Query() query: Omit<GetMessagesDto, 'chatId'>,
    @CurrentUser() user: TokenPayload,
  ) {
    return firstValueFrom(
      this.chatClient.send(CHAT_PATTERNS.GET_MESSAGES, {
        chatId,
        ...query,
        userId: user.userId,
      }),
    );
  }

  @Post(':id/messages')
  sendMessage(
    @Param('id') chatId: string,
    @Body(new ZodValidationPipe(SendMessageSchema))
    body: Pick<SendMessageDto, 'content'>,
    @CurrentUser() user: TokenPayload,
  ) {
    return firstValueFrom(
      this.chatClient.send(CHAT_PATTERNS.SEND_MESSAGE, {
        chatId,
        content: body.content,
        senderId: user.userId,
      }),
    );
  }

  @Post(':id/members')
  addMember(
    @Param('id') chatId: string,
    @Body(new ZodValidationPipe()) body: { userId: string },
    @CurrentUser() user: TokenPayload,
  ) {
    return firstValueFrom(
      this.chatClient.send(CHAT_PATTERNS.ADD_MEMBER, {
        chatId,
        userId: body.userId,
        addedBy: user.userId,
      }),
    );
  }

  @Post(':id/leave')
  leaveChat(@Param('id') chatId: string, @CurrentUser() user: TokenPayload) {
    return firstValueFrom(
      this.chatClient.send(CHAT_PATTERNS.LEAVE_CHAT, {
        chatId,
        userId: user.userId,
      }),
    );
  }
}
