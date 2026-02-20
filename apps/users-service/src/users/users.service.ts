import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import {
  CreateUserDto,
  SearchUsersDto,
  UpdateUserDto,
} from '@app/shared/dtos/users.dtos';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existsUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existsUser) {
      throw new RpcException({
        statusCode: 409,
        message: 'User already exists',
      });
    }

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      username: createUserDto.username,
      hashedPassword: createUserDto.hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string, includePassword = false) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    return includePassword ? user : user;
  }

  async findById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    return this.usersRepository.update(id, {
      username: updateUserDto.username,
      avatar: updateUserDto.avatar,
      bio: updateUserDto.bio,
    });
  }

  async delete(id: string) {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    return { success: true };
  }

  async search(searchUsersDto: SearchUsersDto) {
    if (searchUsersDto.query) {
      const [items, total] = await this.usersRepository.findAndCount({
        where: [
          { username: ILike(`%${searchUsersDto.query}%`) },
          { email: ILike(`%${searchUsersDto.query}%`) },
        ],
        take: searchUsersDto.limit,
        skip: searchUsersDto.offset,
        order: { createdAt: 'DESC' },
      });

      return {
        items,
        total,
      };
    } else {
      const [items, total] = await this.usersRepository.findAndCount({
        take: searchUsersDto.limit,
        skip: searchUsersDto.offset,
        order: { createdAt: 'DESC' },
      });

      return {
        items,
        total,
      };
    }
  }
}
