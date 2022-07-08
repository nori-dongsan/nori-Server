// src/users/usersService.ts
import { UserCreateDto } from "src/interfaces/test/UserCreateDto";
import { provideSingleton } from "../config/provideSingleton";
import { User } from "../entities/User";

@provideSingleton(UsersService)
export class UsersService {
  public get(id: number, firstName: string, lastName: string): User {
    return {
      id,
      firstName,
      lastName,
      age: 20,
    };
  }

  public create(userCreationParams: UserCreateDto): User {
    return {
      id: Math.floor(Math.random() * 10000), // Random
      ...userCreationParams,
    };
  }
}
