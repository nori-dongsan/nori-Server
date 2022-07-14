import {
  Body,
  HttpCode,
  JsonController,
  Post,
  Req,
  Res,
} from "routing-controllers";
import { UserService } from "../services/UserService";
import { OpenAPI } from "routing-controllers-openapi";
import { CreateUserDto, ResponseUserDto } from "../dtos/UserDto";
import { Request, Response } from "express";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import message from "../modules/responseMessage";

@JsonController("/auth")
export class AuthController {
  constructor(private userService: UserService) {}

  @HttpCode(201)
  @Post("/login")
  @OpenAPI({
    summary: "소셜 로그인",
    description: "소셜 로그인 및 유저 등록",
    statusCode: "200",
  })
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    const newUser = await this.userService.create(createUserDto);

    const user: ResponseUserDto = {
      accessToken: "hi",
      refreshToken: newUser.refreshToekn,
      isSignup: false,
    };

    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_USER, user));
  }
}
