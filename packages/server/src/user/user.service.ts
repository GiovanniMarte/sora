import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    return user;
  }

  async createUser(userDto: CreateUserDto) {
    const user = await this.userRepository.findOneBy({ email: userDto.email });

    if (user) {
      throw new ConflictException(`User with email '${userDto.email}' already exists`);
    }

    const newUser = this.userRepository.create(userDto);

    return this.userRepository.save(newUser);
  }

  async removeUser(email: string) {
    const user = await this.findUserByEmail(email);
    return await this.userRepository.remove(user);
  }
}
