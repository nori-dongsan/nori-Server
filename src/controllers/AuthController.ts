import { HttpCode, JsonController, Post, Req, Res } from 'routing-controllers';
import { UserService } from '../services/UserService';
import { OpenAPI } from 'routing-controllers-openapi';
import { CreateUserDto, ResponseUserDto } from '../dtos/UserDto';
import { Response, Request } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { logger } from '../utils/Logger';
import { AuthService } from '../services/AuthService';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../middlewares/AuthMiddleware';

@JsonController('/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @HttpCode(201)
  @Post('/login')
  @OpenAPI({
    summary: '소셜 로그인',
    description: '소셜 로그인 및 유저 등록',
    statusCode: '200',
  })
  /**
   * Error 1. request body에 값이 없을 경우
   * Error 2. Internal Server Error
   */
  public async login(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    const { snsId, email, provider } = req.body;

    // Error 1
    if (!snsId || !email || !provider) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }
    const createUserDto = new CreateUserDto(snsId, email, provider);

    try {
      const user = await this.authService.validateUser(createUserDto.snsId);

      // 이미 가입이 된 유저일 때
      if (user) {
        let responseUserDto: ResponseUserDto = {
          accessToken: generateAccessToken(user),
          refreshToken: user.refreshToken,
          isSignup: false,
        };

        // 회원가입을 완료한 유저인지 확인
        if (user.nickname) {
          responseUserDto.isSignup = true;
        }

        return res
          .status(statusCode.OK)
          .send(
            util.success(statusCode.OK, message.LOGIN_SUCCESS, responseUserDto)
          );
      } else {
        // 신규 가입 유저
        const newUser = await this.userService.create(createUserDto);
        if (!newUser) {
          return res
            .status(statusCode.DB_ERROR)
            .send(util.fail(statusCode.DB_ERROR, message.CREATE_USER_FAIL));
        }

        const responseUserDto: ResponseUserDto = {
          accessToken: generateAccessToken(newUser),
          refreshToken: generateRefreshToken(newUser),
          isSignup: false,
        };
        await this.authService.saveRefreshToken(
          newUser,
          responseUserDto.refreshToken
        );

        return res
          .status(statusCode.OK)
          .send(
            util.success(statusCode.OK, message.LOGIN_SUCCESS, responseUserDto)
          );
      }
    } catch (error) {
      logger.error(error);
      console.log(error);

      // Error 2
      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}
