import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  GetUserByEmailDto,
  SearchUsersDto,
  UpdateUserDto,
  USERS_PATTERNS,
} from '@app/shared';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.CREATE_USER)
  create(@Payload() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @MessagePattern(USERS_PATTERNS.GET_USER_BY_EMAIL)
  getUserByEmail(@Payload() dto: GetUserByEmailDto) {
    return this.usersService.findByEmail(dto.email, dto.includePassword);
  }

  @MessagePattern(USERS_PATTERNS.GET_USER)
  getUserById(@Payload() payload: { id: string }) {
    return this.usersService.findById(payload.id);
  }

  @MessagePattern(USERS_PATTERNS.UPDATE_USER)
  update(@Payload() payload: { id: string } & UpdateUserDto) {
    const { id, ...dto } = payload;
    return this.usersService.update(id, dto);
  }

  @MessagePattern(USERS_PATTERNS.DELETE_USER)
  delete(@Payload() payload: { id: string }) {
    return this.usersService.delete(payload.id);
  }

  @MessagePattern(USERS_PATTERNS.SEARCH_USERS)
  searchUsers(@Payload() dto: SearchUsersDto) {
    return this.usersService.search(dto);
  }
}
