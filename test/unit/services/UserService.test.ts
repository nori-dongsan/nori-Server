import { UserRepository } from '../../../src/repositories/UserRepository';
import { UserService } from '../../../src/services/UserService';
import { AuthService } from '../../../src/services/AuthService';
import { createMemoryDatabase } from '../../utils/CreateMemoryDatabase';
import { UserSeed } from '../../utils/seeds/UserTestSeed';
import { Connection } from 'typeorm';
import { CreateUserDto } from '../../../src/dtos/UserDto';
import { ReturnErrorType } from '../../../src/constants/ReturnErrorType';

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
    id: 1,
    snsId: '123123123',
    email: 'crayon@gmail.com',
    nickname: 'crayon',
    provider: 'google',
  };

  const createUserDto = new CreateUserDto(
    request.snsId,
    request.email,
    request.provider
  );

  it('사용자 정보가 유효한지 확인한다', async () => {
    const isUser = await authService.validateUserBySnsId(request.snsId);

    if (isUser) {
      expect(isUser.id).toBe(request.id);
    } else {
      expect(isUser).toBe(ReturnErrorType.USER_NOT_EXIST_ERROR);
    }
  });

  it('유저를 생성하고 생성된 정보를 반환한다', async () => {
    const newUser = await userService.create(createUserDto);

    if (!newUser) {
      return;
    }

    expect(newUser.snsId).toBe(request.snsId);
    expect(newUser.email).toBe(request.email);
    expect(newUser.provider).toBe(request.provider);
  });

  it('신규 유저의 닉네임을 입력받고 정보를 반환한다', async () => {
    const user = await authService.validateUserBySnsId(request.snsId);
    if (!user) {
      return;
    }

    await userService.updateNickname(user.id, request.nickname);
    const updateUser = await authService.validateUserBySnsId(request.snsId);
    expect(updateUser?.nickname).toBe(request.nickname);
  });
});
