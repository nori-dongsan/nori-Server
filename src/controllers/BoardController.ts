import {
  Delete,
  Get,
  HttpCode,
  JsonController,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseBefore,
  QueryParam,
  Param,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import e, { Response, Request } from 'express';
import { BoardCommentService } from '../services/BoardCommentService';
import { extractAccessToken, verifyAccessToken } from '../middlewares/AuthMiddleware';
import { BoardResponseDto } from '../dtos/BoardDto';
import { Board } from '../entities/Board';
import { BoardService } from '../services/BoardService';
import { UserService } from '../services/UserService';
import s3 from '../modules/s3';
import { BoardCreateDto, BoardPutDto } from '../dtos/BoardDto';
import { User } from '../entities/User';
import { BoardImageService } from '../services/BoardImageService';
import { BoardImageCreateDto } from '../dtos/BoardImageDto';
import { logger } from '../utils/Logger';
import { send } from '../modules/slack';
import { env } from '../env';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { token } from '../dtos/AuthDto';

@JsonController('/board')
export class BoardController {
  constructor(
    private boardService: BoardService,
    private boardCommentService: BoardCommentService,
    private userService: UserService,
    private boardImageService: BoardImageService
  ) { }

  @HttpCode(200)
  @Get('')
  @OpenAPI({
    summary: '게시판 목록 조회',
    description: '게시물 리스트 반환',
    statusCode: '200',
  })
  public async getList(
    @Res() res: Response
  ): Promise<Response> {
    try {
      const boards = await this.boardService.getList();
      return res
        .status(statusCode.CREATED)
        .send(
          util.success(statusCode.OK, message.READ_BAORD_LIST_SUCCESS, boards)
        );
    } catch (err) {
      logger.error(err)
      await send(err as Error["message"])
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
    }
  }
  @UseBefore(verifyAccessToken)
  @HttpCode(201)
  @Post('')
  public async postBoard(
    @Req() req: Request,
    @Res() res: Response,
    @UploadedFiles('imageList') files: Express.Multer.File[]
  ) {
    const { id } = res.locals.jwtPayload;
    const { title, content, section } = req.body;
    try {
      const user = await this.userService.getUser(id);
      const boardCreateDto = new BoardCreateDto();
      boardCreateDto.title = title;
      boardCreateDto.section = section;
      boardCreateDto.content = content;
      boardCreateDto.user = user as User;
      const board = await this.boardService.create(boardCreateDto);
      // TODO: 이미지 없을 시 분기처리

      if (files) {
        await Promise.all(files.map(async (file) => {
          const keyName = `${Date.now()}_${file.originalname}`;
          const params = {
            Key: keyName,
            Bucket: 'nori-community',
            Body: file.buffer,
            ACL: 'public-read',
          };
          await s3.upload(params).promise();
          const boardImageCreateDto = new BoardImageCreateDto();
          boardImageCreateDto.board = board!;
          boardImageCreateDto.imageLink = keyName;
          await this.boardImageService.create(boardImageCreateDto);
        }));
      }
      const result = {
        boardId: board?.id,
      };
      return res.send(
        util.success(statusCode.CREATED, message.CREATE_BOARD_SUCCESS, result)
      );
    } catch (err) {
      logger.error(err);
      await send(err as Error["message"])
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
  @Get('/:boardId')
  @OpenAPI({
    summary: '게시글 조회',
    description: '게시글 반환',
    statusCode: '200',
  })
  public async get(
    @Res() res: Response,
    @Req() req: Request,
    @Param('boardId') boardId: number
  ): Promise<Response> {
    const { accesstoken } = req.headers
    let id
    if (accesstoken) {
      const jwtPayload = jwt.decode(String(accesstoken));
      const jwtPayloadType = jwtPayload as JwtPayload;
      id = jwtPayloadType.id
    }
    const board = await this.boardService.get(boardId);
    let author = false;
    if (id && board?.user.id == id) {
      author = true;
    }
    if (!board) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.READ_BOARD_FAIL));
    }
    const comment = await this.boardCommentService.getListByBoard(board);
    const boardResponseDto = new BoardResponseDto(board, comment!, 13);
    boardResponseDto['author'] = author;
    return res
      .status(statusCode.CREATED)
      .send(
        util.success(
          statusCode.OK,
          message.READ_BAORD_LIST_SUCCESS,
          boardResponseDto
        )
      );
  }

  // @UseBefore(verifyAccessToken)
  @HttpCode(200)
  @Delete('/:boardId')
  @OpenAPI({
    summary: '게시글 삭제',
    description: '게시글 삭제',
    statusCode: '200',
  })
  public async delete(@Res() res: Response, @Param('boardId') boardId: number) {
    try {
      await this.boardService.delete(boardId);
      return res
        .status(statusCode.OK)
        .send(util.success(statusCode.OK, message.DELETE_BOARD_SUCCESS));
    } catch (err) {
      logger.error(err);
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

  @UseBefore(verifyAccessToken)
  @HttpCode(200)
  @Put('/:boardId')
  @OpenAPI({
    summary: '게시글 수정',
    description: '게시글 수정',
    statusCode: '200',
  })
  public async put(
    @Res() res: Response,
    @Req() req: Request,
    @Param('boardId') boardId: number,
    @UploadedFiles('imageList') files?: Express.Multer.File[]
  ) {
    const { title, content, category } = req.body;
    try {
      const boardPutDto = new BoardPutDto();
      boardPutDto.boardId = boardId;
      const board = await this.boardService.get(boardId);
      if (title) boardPutDto.title = title;
      else boardPutDto.title = board!.title;
      if (content) boardPutDto.content = content;
      else boardPutDto.content = board!.content;
      if (category) boardPutDto.section = category
      else boardPutDto.section = board!.section

      await this.boardService.put(boardPutDto);
      if (files) {
        await this.boardImageService.delete(board!);
        files.map(async (file) => {
          const keyName = `${Date.now()}_${file.originalname}`;
          const params = {
            Key: keyName,
            Bucket: 'nori-community',
            Body: file.buffer,
            ACL: 'public-read',
          };
          await s3.upload(params).promise();
          const boardImageCreateDto = new BoardImageCreateDto();
          boardImageCreateDto.board = board!;
          boardImageCreateDto.imageLink = keyName;
          await this.boardImageService.create(boardImageCreateDto);
        });
      }
      const result = {
        boardId: board?.id,
      };
      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.FETCH_HOME_DATA_SUCCESS, result)
        );
    } catch (err) {
      logger.error(err);
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
