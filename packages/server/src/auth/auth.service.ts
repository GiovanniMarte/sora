import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtResponse } from '../types/custom';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userService.findByEmail(loginUserDto.email);

    const valid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<JwtResponse> {
    const user = await this.validateUser(loginUserDto);

    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
