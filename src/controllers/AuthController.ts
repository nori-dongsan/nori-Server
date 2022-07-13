import { Body, HttpCode, JsonController, Post, Res } from "routing-controllers";
import { UserService } from "../services/UserService";
import { OpenAPI } from "routing-controllers-openapi";
import { CreateUserDto, ResponseUserDto } from "../dtos/UserDto";
import { Response } from "express";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import message from "../modules/responseMessage";

@JsonController("/auth")
export class AuthController {
  constructor(private userService: UserService) {}

  @HttpCode(201)
  @Post("/signup")
  @OpenAPI({
    summary: "사용자 회원가입",
    description: "사용자 생성 후 반환",
    statusCode: "201",
  })
  public async register(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response
  ): Promise<Response> {
    const newUser = await this.userService.create(createUserDto);

    const user: ResponseUserDto = {
      email: newUser.email,
      provider: newUser.provider,
    };

    return res
      .status(statusCode.CREATED)
      .send(util.success(statusCode.CREATED, message.CREATE_USER, user));
  }
}
