import {
  HttpCode,
  JsonController,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from 'routing-controllers';
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
  verifyAccessToken,
  verifyRefreshToken,
} from '../middlewares/AuthMiddleware';
import { CreateTokenDto } from '../dtos/AuthDto';

@JsonController('/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @HttpCode(200)
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
      const user = await this.authService.validateUserBySnsId(
        createUserDto.snsId
      );

      // 이미 가입이 된 유저일 때
      if (user) {
        let responseUserDto: ResponseUserDto = {
          accessToken: generateAccessToken(user),
          refreshToken: generateRefreshToken(user),
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

  @HttpCode(200)
  @Put('/signup')
  @OpenAPI({
    summary: '회원가입',
    description: '사용자 닉네입 입력 후 정보 업데이트',
    statusCode: '200',
  })
  /**
   * Error 1. 닉네임이 공백으로 넘어왔을 때
   * Error 2. 이미 사용중인 닉네임일 경우
   * Error 3. Internal Server Error
   */
  @UseBefore(verifyAccessToken)
  public async updateNickname(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    const { id } = res.locals.jwtPayload;
    const { nickname } = req.body;

    // Error 1
    if (!nickname) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
    }

    try {
      const user = await this.userService.findByNickname(nickname);

      // Error 2
      if (user) {
        return res
          .status(statusCode.CONFLICT)
          .send(util.fail(statusCode.CONFLICT, message.DUPLICATE_NICKNAME));
      }

      await this.userService.updateNickname(id, nickname);

      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.CREATE_USER));
    } catch (error) {
      logger.error(error);
      console.log(error);

      // Error 3
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

  @HttpCode(200)
  @Post('/token/refresh')
  @OpenAPI({
    summary: '토큰 재발급',
    description: 'RefreshToken을 이용해서 AccessToken을 재발급',
    statusCode: '200',
    responses: {
      '401': {
        description: 'Unauthoried',
      },
    },
    security: [{ bearedAuth: [] }],
  })
  /**
   * Error 1. 해당 refreshToken의 유저가 없을 시
   */
  @UseBefore(verifyRefreshToken)
  public async refreshToken(@Res() res: Response) {
    const { id } = res.locals.jwtPayload;
    const refreshToken = res.locals.token;

    try {
      const user = await this.authService.validateUserToken(id, refreshToken);

      // Error 1.
      if (!user) {
        return res
          .status(statusCode.UNAUTHORIZED)
          .send(util.fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
      }

      const accessToken = generateAccessToken(user);
      const createTokenDto: CreateTokenDto = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.CREATE_TOKEN, createTokenDto)
        );
    } catch (error) {
      logger.error(error);
      console.log(error);

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
