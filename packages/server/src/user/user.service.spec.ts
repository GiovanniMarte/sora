import { faker } from '@faker-js/faker';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository: Repository<User>;
  let user: User;
  let userDto: CreateUserDto;

  beforeAll(() => {
    user = {
      id: faker.datatype.number(100),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      avatar: faker.internet.avatar(),
      bio: faker.lorem.words(10),
    };

    const { id, ...restUser } = user;
    userDto = restUser;
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(user),
            create: jest.fn().mockReturnValue(user),
            save: jest.fn().mockResolvedValue(user),
            remove: jest.fn().mockResolvedValue(user),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user and return it', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOneBy');
      const foundUser = userService.findByEmail(user.email);

      await expect(foundUser).resolves.toEqual(user);
      expect(findOneSpy).toBeCalledWith({ email: user.email });
    });

    it('should fail to find a user and throw a NotFoundException', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const foundUser = userService.findByEmail(user.email);

      await expect(foundUser).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toBeCalledWith({ email: user.email });
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const bcryptSpy = jest.spyOn(bcrypt, 'hash');
      const createSpy = jest.spyOn(userRepository, 'create');
      const saveSpy = jest.spyOn(userRepository, 'save');

      const createdUser = userService.createUser(userDto);

      await expect(createdUser).resolves.toEqual(user);
      expect(findOneSpy).toHaveBeenCalledWith({ email: userDto.email });
      expect(bcryptSpy).toHaveBeenCalledWith(user.password, 10);
      expect(createSpy).toHaveBeenCalledWith({ ...userDto, password: expect.any(String) });
      expect(saveSpy).toHaveBeenCalledWith(user);
    });

    it('should fail to create a user and throw a ConflictException', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOneBy');
      const foundUser = userService.createUser(userDto);

      await expect(foundUser).rejects.toThrow(ConflictException);
      expect(findOneSpy).toBeCalledWith({ email: user.email });
    });
  });

  describe('removeUser', () => {
    it('should remove a user without throwing any exception', async () => {
      const findOneSpy = jest.spyOn(userRepository, 'findOneBy');
      const removeSpy = jest.spyOn(userRepository, 'remove');

      const result = userService.removeUser(user.email);

      await expect(result).resolves.toEqual(user);
      expect(findOneSpy).toHaveBeenCalledWith({ email: userDto.email });
      expect(removeSpy).toHaveBeenCalledWith(user);
    });
  });
});
