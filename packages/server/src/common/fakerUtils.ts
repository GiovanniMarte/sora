import { CreateUserDto } from '../user/dtos/create-user.dto';
import { faker } from '@faker-js/faker';
import { LoginUserDto } from '../user/dtos/login-user.dto';

export const createFakeUser = ({
  username = faker.internet.userName(),
  email = faker.internet.email(),
  password = faker.internet.password(),
  avatar = faker.internet.avatar(),
  bio = faker.lorem.words(10),
} = {}): CreateUserDto => ({
  username,
  email,
  password,
  avatar,
  bio,
});

export const createFakeLoginUser = (): LoginUserDto => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});
