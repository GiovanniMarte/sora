import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../user/dtos/login-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { createUserStub } from '../../user/__tests__/stubs/user.stub';

describe('AuthService', () => {
  let module: TestingModule;
  let authService: AuthService;
  let userService: UserService;
  let user: User;
  let loginUser: LoginUserDto;

  beforeAll(() => {
    user = createUserStub();
    const { email, password } = user;

    loginUser = { email, password };
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: { findByEmail: jest.fn().mockResolvedValue(user) } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('jwt_string') } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should compare passwords against database and return the user', async () => {
      const bcryptSpy = jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true);

      const validUser = authService.validateUser(loginUser);

      await expect(validUser).resolves.toEqual(user);
      expect(userService.findByEmail).toHaveBeenCalledWith(loginUser.email);
      expect(bcryptSpy).toHaveBeenCalledWith(loginUser.password, user.password);
    });

    it('should fail to compare passwords and throw a UnauthorizedException', async () => {
      const bcryptSpy = jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(false);

      const validUser = authService.validateUser(loginUser);

      await expect(validUser).rejects.toThrow(UnauthorizedException);
      expect(userService.findByEmail).toHaveBeenCalledWith(loginUser.email);
      expect(bcryptSpy).toHaveBeenCalledWith(loginUser.password, user.password);
    });
  });

  describe('login', () => {
    it('should validate user credentials and return an access token', async () => {
      const validateUserSpy = jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      const authToken = authService.login(loginUser);

      await expect(authToken).resolves.toEqual({ accessToken: 'jwt_string' });
      expect(validateUserSpy).toHaveBeenCalledWith(loginUser);
    });
  });
});
