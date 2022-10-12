import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { createUserStub } from './stubs/user.stub';

describe('UserService', () => {
  let module: TestingModule;
  let service: UserService;
  let repository: Repository<User>;
  let user: User;
  let createUser: CreateUserDto;

  beforeAll(() => {
    user = createUserStub();
    const { username, email, password } = user;

    createUser = { username, email, password };
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

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user and return it', async () => {
      const foundUser = service.findByEmail(user.email);

      await expect(foundUser).resolves.toEqual(user);
      expect(repository.findOneBy).toBeCalledWith({ email: user.email });
    });

    it('should fail to find a user and throw a NotFoundException', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const foundUser = service.findByEmail(user.email);

      await expect(foundUser).rejects.toThrow(NotFoundException);
      expect(findOneSpy).toBeCalledWith({ email: user.email });
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const findOneSpy = jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const bcryptSpy = jest.spyOn(bcrypt, 'hash');

      const createdUser = service.createUser(createUser);

      await expect(createdUser).resolves.toEqual(user);
      expect(findOneSpy).toHaveBeenCalledWith({ email: createUser.email });
      expect(bcryptSpy).toHaveBeenCalledWith(user.password, 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createUser,
        password: expect.any(String),
      });
      expect(repository.save).toHaveBeenCalledWith(user);
    });

    it('should fail to create a user and throw a ConflictException', async () => {
      const foundUser = service.createUser(createUser);

      await expect(foundUser).rejects.toThrow(ConflictException);
      expect(repository.findOneBy).toBeCalledWith({ email: user.email });
    });
  });

  describe('removeUser', () => {
    it('should remove a user without throwing any exception', async () => {
      const result = service.removeUser(user.email);

      await expect(result).resolves.toEqual(user);
      expect(repository.findOneBy).toHaveBeenCalledWith({ email: createUser.email });
      expect(repository.remove).toHaveBeenCalledWith(user);
    });
  });
});
