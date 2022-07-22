import { timestamp } from "aws-sdk/clients/cloudfront";

/**
 * 토큰 재발급 ResponseDto
 */
export class CreateTokenDto {
  public accessToken: string;

  public refreshToken: string;
}

export interface token {
  id: number,
  iat: timestamp,
  exp: timestamp,
  iss: string
}