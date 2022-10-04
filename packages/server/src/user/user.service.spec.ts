import { ConflictException, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { createFakeUser } from '../common/fakerUtils';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import databaseConfig from '../config/database.config';

describe('UserService', () => {
  let module: TestingModule;
  let userService: UserService;
  let userRepository: Repository<User>;

  const fakeUser = createFakeUser();
  const { password: fakeUserPassword, ...restFakeUser } = fakeUser;

  const setupModule = async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [databaseConfig],
          envFilePath: `.env.test`,
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            ...configService.get('database'),
          }),
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  };

  beforeEach(setupModule);

  afterEach(async () => {
    await module.close();
  });

  afterAll(async () => {
    console.log('clearing database...');
    await setupModule();
    await userRepository.clear();
    await module.close();
  });

  it('should be defined', async () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const { id, password, ...restUser } = await userService.createUser(fakeUser);

      const valid = await bcrypt.compare(fakeUser.password, password);

      expect(restUser).toEqual(restFakeUser);
      expect(id).toBeGreaterThanOrEqual(0);
      expect(valid).toBe(true);
    });

    it('should fail to create a user and throw a ConflictException', async () => {
      await expect(userService.createUser(fakeUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByEmail', () => {
    it('should find a user and return it', async () => {
      const { id, password, ...restUser } = await userService.findByEmail(fakeUser.email);

      expect(restUser).toEqual(restFakeUser);
    });

    it('should fail to find a user and throw a NotFoundException', async () => {
      await expect(userService.findByEmail('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUser', () => {
    it('should remove a user without throwing any exception', async () => {
      await expect(userService.removeUser(fakeUser.email)).resolves.not.toThrowError();
    });

    it('should fail to remove a user and throw a NotFoundException', async () => {
      await expect(userService.removeUser('invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
