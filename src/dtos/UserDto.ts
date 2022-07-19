import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';
import { User } from '../entities/User';

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

export class UserDto {
  public id: number
  public snsId: string
  public nickname: string
  public isDeleted: boolean
  public provider: string
  public email: string
  public createdAt: Date
  public updatedAt: Date
  public refreshToken: string

  constructor(
    user: User
  ) {
    this.id = user.id
    this.snsId = user.snsId
    this.nickname = user.nickname
    this.isDeleted = user.isDeleted
    this.provider = user.provider
    this.email = user.email
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.refreshToken = user.refreshToken
  }

}