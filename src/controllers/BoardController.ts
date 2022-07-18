import { Get, HttpCode, JsonController, Param, Req, Res, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import e, { Response } from "express";
import { BoardService } from "../services/boardService";
import { verifyAccessToken } from "../middlewares/AuthMiddleware";
import { BoardResponseDto } from "../dtos/BoardDto";
import { Board } from "../entities/Board";
import { BoardCommentService } from "../services/BoardCommentService";

@JsonController("/board")
export class BoardController {
    constructor(private boardService: BoardService,
        private boardCommentService: BoardCommentService) { }

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

    // @UseBefore(verifyAccessToken)
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
        // const { id } = res.locals.jwtPayload;
        const id = 14
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
}