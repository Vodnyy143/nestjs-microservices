import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import {
  SearchUsersDto,
  SearchUsersSchema,
  UpdateUserDto,
  UpdateUserSchema,
  USERS_PATTERNS,
} from '@app/shared';

@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get('search')
  @ApiOperation({ summary: 'Get all users by queries' })
  @ApiQuery({
    name: 'query',
    type: 'string',
    example: 'text',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    type: 'number',
    example: 0,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    example: 10,
    required: false,
  })
  async search(
    @Query(new ZodValidationPipe(SearchUsersSchema))
    searchUsersDto: SearchUsersDto,
  ) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.SEARCH_USERS, searchUsersDto),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'uuid',
  })
  async getUser(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.GET_USER, { id }),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'artem' },
        bio: { type: 'string', example: 'the best man' },
        avatar: { type: 'string', example: 'avatar' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto,
  ) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.UPDATE_USER, { id, ...dto }),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: 'uuid',
  })
  async delete(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send(USERS_PATTERNS.DELETE_USER, { id }),
    );
  }
}
