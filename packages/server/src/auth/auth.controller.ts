import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return req.user;
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Delete('remove/:email')
  remove(@Param('email') email: string) {
    return this.userService.removeUser(email);
  }
}
