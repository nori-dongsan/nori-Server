import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';

/**
 * 사용자 생성 DTO
 */
export class CreateUserDto {
  constructor(snsId: string, email: string, provider: string) {
    this.snsId = snsId;
    this.email = email;
    this.provider = provider;
  }

  @IsNotEmpty()
  public snsId: string;

  @IsNotEmpty()
  @Length(1, 50)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public provider: string;
}

/**
 * 사용자 Response DTO
 */
export class ResponseUserDto {
  public accessToken: string;

  public refreshToken: string;

  public isSignup: boolean;
}
