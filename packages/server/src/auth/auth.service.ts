import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByEmail(loginUserDto.email);

    const valid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return user;
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
