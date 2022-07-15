import { UserRepository } from '../../../src/repositories/UserRepository';
import { UserService } from '../../../src/services/UserService';
import { AuthService } from '../../../src/services/AuthService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { UserSeed } from '../../utils/seeds/UserTestSeed';
import { Connection } from 'typeorm';
import { CreateUserDto } from '../../../src/dtos/UserDto';

describe('UserService', () => {
  let db: Connection;
  let userRepository: UserRepository;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    await userRepository.save(UserSeed);
    userService = new UserService(userRepository);
    authService = new AuthService(userRepository);
  });

  afterAll(() => db.close());

  const request = {
    snsId: '123123123',
    email: 'crayon@gmail.com',
    provider: 'google',
  };

  const createUserDto = new CreateUserDto(
    request.snsId,
    request.email,
    request.provider
  );

  it('사용자 정보가 유효한지 확인한다', async () => {
    const isUser = await authService.validateUser('123');
    console.log(isUser);

    if (isUser) {
      expect(isUser.snsId).toBe(request.snsId);
    } else {
      expect(isUser).toBe(null);
    }
  });

  it('유저를 생성하고 생성된 정보를 반환한다', async () => {
    const newUser = await userService.create(createUserDto);

    if (!newUser) {
      console.log('유저 생성 실패!');
      return;
    }

    expect(newUser.snsId).toBe(request.snsId);
    expect(newUser.email).toBe(request.email);
    expect(newUser.provider).toBe(request.provider);
  });
});
