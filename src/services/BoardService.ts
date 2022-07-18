import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BoardDto, BoardPutDto } from "../dtos/BoardDto";
import { Board } from "../entities/Board";
import { BoardRepository } from "../repositories/BoardRepository";
import { logger } from "../utils/Logger";

@Service()
export class BoardService {
    constructor(@InjectRepository() private boardRepository: BoardRepository) { }

    /**
     * 게시판 목록 조회
     */
    public async getList(): Promise<Board[]> {
        return await this.boardRepository.find({
            skip: 0,
            take: 10
        })
    }
    /**
     * 게시물 조회
     * @param boardId 
     */
    public async get(boardId: number): Promise<Board | undefined> {
        try {
            const board = await this.boardRepository.findOne({ id: boardId }, { relations: ['boardImages', 'boardComments', 'user'] })
            return board
        } catch (err) {
            logger.error(err)
        }

    }

    /**
     * 게시물 삭제
     * @param boardId 
     */
    public async delete(boardId: number) {
        try {
            await this.boardRepository.delete({ id: boardId })
        } catch (err) {
            logger.error(err)
        }
    }

    /**
     * 게시물 수정
     * @param boardPutDto 
     */
    public async put(boardPutDto: BoardPutDto) {
        try {
            await this.boardRepository.update(boardPutDto.boardId, { content: boardPutDto.content, boardImages: boardPutDto.imageList })
        } catch (err) {
            logger.error(err)
        }
    }
}