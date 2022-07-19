import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BoardCommentCreateDto } from "../dtos/BoardCommentDto";
import { Board } from "../entities/Board";
import { BoardCommentRepository } from "../repositories/BoardCommentRepository";
import { logger } from "../utils/Logger";

@Service()
export class BoardCommentService {
    constructor(@InjectRepository() private boardCommentRepository: BoardCommentRepository) { }

    /**
     * 댓글 작성
     */
    public async create(commentCreateDto: BoardCommentCreateDto) {
        try {
            const comment = this.boardCommentRepository.create(commentCreateDto)
            await this.boardCommentRepository.save(comment)
        } catch (err) {
            logger.error(err)
        }
    }

    public async getListByBoard(board: Board) {
        try {
            return await this.boardCommentRepository.find({ where: { board: board }, relations: ["user"] })
        } catch (err) {
            logger.error(err)
        }
    }
}