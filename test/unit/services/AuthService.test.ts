import { UserRepository } from '../../../src/repositories/UserRepository';
import { UserService } from '../../../src/services/UserService';
import { AuthService } from '../../../src/services/AuthService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { UserSeed } from '../../utils/seeds/UserTestSeed';
import { Connection } from 'typeorm';
import { CreateUserDto } from '../../../src/dtos/UserDto';
import { ReturnErrorType } from '../../../src/constants/ReturnErrorType';
import { CreateTokenDto } from '../../../src/dtos/AuthDto';

describe('AuthService', () => {
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
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
  };

  it('유효하지 않은 리프레시 토큰이 오면 토큰을 발급하지 않는다.', async () => {
    const isUser = await authService.validateUserBySnsId(request.accessToken);

    if (isUser) {
      const accessToken = generateAccessToken(isUser);
    } else {
      expect(isUser).toBeNull();
    }
  });
});

function generateAccessToken(user: any) {
  throw new Error('Function not implemented.');
}
