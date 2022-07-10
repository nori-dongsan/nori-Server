// src/users/usersService.ts
import { TestCreateDto } from "../interfaces/test/UserCreateDto";
import { TestRepository } from "../repositories/TestRepository";
import { getCustomRepository } from "typeorm";
import { provideSingleton } from "../config/provideSingleton";
import { Test } from "../entities/Test";

@provideSingleton(TestService)
export class TestService {
  public async create(testCreateDto: TestCreateDto) {
    const testRepository = getCustomRepository(TestRepository);
    const newTest = new Test();
    newTest.snsId = testCreateDto.snsId;
    newTest.nickname = testCreateDto.nickname;
    newTest.provider = testCreateDto.provider;
    newTest.email = testCreateDto.email;

    await testRepository.save(newTest);

    return newTest;
  }
}
