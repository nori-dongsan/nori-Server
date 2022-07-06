// src/users/usersService.ts
import { User } from "../models/user";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "firstName" | "lastName" | "age">;

export class UsersService {
  public get(id: number, firstName: string, lastName: string): User {
    return {
      id,
      firstName,
      lastName,
      age: 20,
    };
  }

  public create(userCreationParams: UserCreationParams): User {
    return {
      id: Math.floor(Math.random() * 10000), // Random
      ...userCreationParams,
    };
  }
}
