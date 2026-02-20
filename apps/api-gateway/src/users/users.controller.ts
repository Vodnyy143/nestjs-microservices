import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { USERS_PATTERNS } from '@app/shared';
import {
  CreateUserDto,
  CreateUserSchema,
  SearchUsersDto,
  SearchUsersSchema,
  UpdateUserDto,
  UpdateUserSchema,
} from '@app/shared/dtos/users.dtos';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get('search')
  async search(
    @Query(new ZodValidationPipe(SearchUsersSchema))
    searchUsersDto: SearchUsersDto,
  ) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.SEARCH_USERS, searchUsersDto),
    );
  }

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateUserSchema))
    dto: CreateUserDto,
  ) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.CREATE_USER, dto),
    );
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.GET_USER, { id }),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto,
  ) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.UPDATE_USER, { id, ...dto }),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.DELETE_USER, { id }),
    );
  }
}
