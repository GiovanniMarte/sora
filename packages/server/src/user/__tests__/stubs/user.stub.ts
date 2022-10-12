import { faker } from '@faker-js/faker';
import { User } from '../../entities/user.entity';

export const createUserStub = (): User => ({
  id: faker.datatype.number(100),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  avatar: faker.internet.avatar(),
  bio: faker.lorem.words(10),
});
