import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginUserDto } from '../user/dtos/login-user.dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.findUserByEmail(loginUserDto.email);
  }

  @Post('logout')
  logout() {
    return {};
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete('remove/:email')
  remove(@Param('email') email: string) {
    return this.userService.removeUser(email);
  }
}
