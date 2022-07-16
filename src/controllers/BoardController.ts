import { Get, HttpCode, JsonController, Res } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import { Response } from "express";
import { BoardService } from "../services/boardService";

@JsonController("/board")
export class BoardController {
    constructor(private boardService: BoardService) { }

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
}