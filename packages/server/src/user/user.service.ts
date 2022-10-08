import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    return user;
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: userDto.email });

    if (user) {
      throw new ConflictException(`User with email '${userDto.email}' already exists`);
    }

    const hash = await bcrypt.hash(userDto.password, 10);

    const newUser = this.userRepository.create({ ...userDto, password: hash });

    return this.userRepository.save(newUser);
  }

  async removeUser(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    return await this.userRepository.remove(user);
  }
}
