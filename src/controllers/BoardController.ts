import { Delete, Get, HttpCode, JsonController, Param, Req, Res, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import { Response, Request } from "express";
import { BoardService } from "../services/BoardService";
import { UserService } from "../services/UserService";
import s3 from "../modules/s3";
import { BoardCreateDto } from "../dtos/BoardDto";
import { User } from "../entities/User";
import { BoardImageService } from "../services/BoardImageService";
import { BoardImageCreateDto } from "../dtos/BoardImageDto";
import { logger } from "../utils/Logger";
import { verifyAccessToken } from "../middlewares/AuthMiddleware";
import { BoardResponseDto } from "../dtos/BoardDto";
import { Board } from "../entities/Board";
import { BoardCommentService } from "../services/BoardCommentService";
import { logger } from "../utils/Logger";

@JsonController("/board")
export class BoardController {
    constructor(private boardService: BoardService,
        private userService: UserService,
        private boardImageService: BoardImageService) { }

    @HttpCode(200)
    @Get("")
    @OpenAPI({
        summary: "게시판 목록 조회",
        description: "게시물 리스트 반환",
        statusCode: "200"
    })
    public async getList(
        @Res() res: Response
    ): Promise<Response> {
        const boards = await this.boardService.getList()

        return res.status(statusCode.CREATED).send(util.success(statusCode.OK, message.READ_BAORD_LIST_SUCCESS, boards))
    }

    @UseBefore(verifyAccessToken)
    @HttpCode(201)
    @Post("")
    public async postBoard(
        @Req() req: Request,
        @Res() res: Response,
        @UploadedFiles("imageList") files: Express.Multer.File[]
    ) {
        const userId = res.locals.jwtPayload
        const { title, content } = req.body
        try {

            const user = await this.userService.getUser(userId)
            const boardCreateDto = new BoardCreateDto()
            boardCreateDto.title = title
            boardCreateDto.content = content
            boardCreateDto.user = user as User
            const board = await this.boardService.create(boardCreateDto)
            files.map(async (file) => {
                const keyName = `${Date.now()}_${file.originalname}`
                const params = {
                    Key: keyName,
                    Bucket: 'nori-community',
                    Body: file.buffer,
                    ACL: "public-read"
                }
                await s3.upload(params).promise()
                const boardImageCreateDto = new BoardImageCreateDto()
                boardImageCreateDto.board = board!
                boardImageCreateDto.imageLink = keyName
                await this.boardImageService.create(boardImageCreateDto)
            })
            return res.send(util.success(statusCode.CREATED, message.CREATE_BOARD_SUCCESS))
        } catch (err) {
            logger.error(err)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
        }
    }

    @UseBefore(verifyAccessToken)
    @HttpCode(200)
    @Get("/:boardId")
    @OpenAPI({
        summary: "게시글 조회",
        description: "게시글 반환",
        statusCode: "200"
    })
    public async get(
        @Res() res: Response,
        @Param("boardId") boardId: number
    ): Promise<Response> {
        const { id } = res.locals.jwtPayload;
        const board = await this.boardService.get(boardId)
        let author = false
        if (board?.user.id == id) {
            author = true
        }
        if (!board) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.READ_BOARD_FAIL))
        }
        const comment = await this.boardCommentService.getListByBoard(board)
        const boardResponseDto = new BoardResponseDto(board, comment!)
        boardResponseDto["author"] = author
        return res.status(statusCode.CREATED).send(util.success(statusCode.OK, message.READ_BAORD_LIST_SUCCESS, boardResponseDto))
    }

    @UseBefore(verifyAccessToken)
    @HttpCode(200)
    @Delete("/:boardId")
    @OpenAPI({
        summary: "게시글 삭제",
        description: "게시글 삭제",
        statusCode: "200"
    })
    public async delete(
        @Res() res: Response,
        @Param("boardId") boardId: number
    ) {
        try {
            await this.boardService.delete(boardId)
            return res.status(statusCode.OK).send(util.success(statusCode.OK, message.DELETE_BOARD_SUCCESS))
        } catch (err) {
            logger.error(err)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR))
        }
    }
}
