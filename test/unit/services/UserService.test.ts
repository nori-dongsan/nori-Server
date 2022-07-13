import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserService } from "../../../src/services/UserService";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { Connection } from "typeorm";
import { CreateUserDto } from "../../../src/dtos/UserDto";

describe("UserService", () => {
  let db: Connection;
  let userRepository: UserRepository;
  let userService: UserService;

  beforeAll(async () => {
    db = await createMemoryDatabase();
    userRepository = db.getCustomRepository(UserRepository);
    await userRepository.save(UserSeed);
    userService = new UserService(userRepository);
  });

  afterAll(() => db.close());

  const request = {
    snsId: "123123123",
    email: "crayon@gmail.com",
    provider: "google",
  };

  const createUserDto = new CreateUserDto();
  createUserDto.snsId = request.snsId;
  createUserDto.email = request.email;
  createUserDto.provider = request.provider;

  it("유저를 생성하고 생성된 정보를 반환한다", async () => {
    const newUser = await userService.create(createUserDto);
    expect(newUser.snsId).toBe(request.snsId);
    expect(newUser.email).toBe(request.email);
    expect(newUser.provider).toBe(request.provider);
  });
});
