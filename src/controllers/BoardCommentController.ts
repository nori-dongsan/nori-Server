import { Body, BodyParam, HttpCode, Post, Res, UseBefore } from "routing-controllers"
import { OpenAPI } from "routing-controllers-openapi"
import { JsonController } from "routing-controllers/decorator/JsonController"
import { BoardCommentCreateDto, BoardCommentRequsetDto } from "../dtos/BoardCommentDto"
import statusCode from "../modules/statusCode"
import { BoardCommentService } from "../services/BoardCommentService"
import { BoardService } from "../services/boardService"
import { UserService } from "../services/UserService"
import { Response } from "express"
import message from "../modules/responseMessage"
import util from "../modules/util"
import { verifyAccessToken } from "../middlewares/AuthMiddleware"

@JsonController("/board/comment")
export class BoardCommentController {
    constructor(private boardCommentService: BoardCommentService,
        private userService: UserService,
        private boardService: BoardService) { }

    @UseBefore(verifyAccessToken)
    @HttpCode(200)
    @Post("")
    @OpenAPI({
        summary: "댓글 작성",
        description: "바디를 통해 댓글 생성",
        statusCode: "200"
    })
    public async create(
        @Res() res: Response,
        @Body() body: BoardCommentRequsetDto,
    ): Promise<Response> {
        const { id } = res.locals.jwtPayload
        const boardCommentCreateDto = new BoardCommentCreateDto()
        const user = await this.userService.get(id)
        const { content, boardId } = body
        const board = await this.boardService.get(boardId)

        if (!user || !board) {
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST))
        } else {
            boardCommentCreateDto.board = board
            boardCommentCreateDto.user = user
            boardCommentCreateDto.content = content
            await this.boardCommentService.create(boardCommentCreateDto)
            return res.status(statusCode.OK).send(util.success(statusCode.OK, message.CREATE_COMMENT_SUCCESS))
        }
    }
}