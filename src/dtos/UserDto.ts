import { IsNotEmpty, Length, IsEmail } from "class-validator";
import { User } from "../entities/User";

/**
 * 사용자 생성 DTO
 */
export class CreateUserDto {
  @IsNotEmpty()
  public snsId: string;

  @IsNotEmpty()
  @Length(1, 50)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public provider: string;

  public toEntity(): User {
    const { snsId, email, provider } = this;

    const user = new User();
    user.snsId = snsId;
    user.email = email;
    user.provider = provider;

    return user;
  }
}

/**
 * 사용자 Response DTO
 */
export class ResponseUserDto {
  public accessToken: string;

  public refreshToken: string;

  public isSignup: boolean;
}
