import { Test, TestingModule } from '@nestjs/testing';
import { JwtResponse } from '../../types/custom';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { LoginUserDto } from '../../user/dtos/login-user.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';
import { createUserStub } from '../../user/__tests__/stubs/user.stub';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { FastifyRequest } from 'fastify';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userService: UserService;
  let user: User;
  let loginUser: LoginUserDto;
  let createUser: CreateUserDto;
  let jwt: JwtResponse;
  let request: FastifyRequest;

  beforeAll(() => {
    user = createUserStub();
    const { id, username, email, password } = user;

    createUser = { username, email, password };
    loginUser = { email, password };

    jwt = { accessToken: 'jwt_token' };
    request = {
      user: { email, sub: id },
    } as FastifyRequest;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(user),
            removeUser: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockResolvedValue(user),
            login: jest.fn().mockResolvedValue(jwt),
          },
        },
      ],
      controllers: [AuthController],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should call login and return a jwt', async () => {
    const result = await authController.login(loginUser);

    expect(result).toEqual(jwt);
    expect(authService.login).toBeCalledWith(loginUser);
  });

  it('should call createUser and return a user', async () => {
    const result = await authController.register(createUser);

    expect(result).toEqual(user);
    expect(userService.createUser).toHaveBeenCalledWith(createUser);
  });

  it('should call removeUser and return a user', async () => {
    const result = await authController.remove(request);

    expect(result).toEqual(user);
    expect(userService.removeUser).toHaveBeenCalledWith(request.user.email);
  });

  it('should call findByEmail and return a user', async () => {
    const result = await authController.current(request);

    expect(result).toEqual(user);
    expect(userService.findByEmail).toHaveBeenCalledWith(request.user.email);
  });
});
