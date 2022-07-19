import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BoardCreateDto } from "../dtos/BoardDto";
import { Board } from "../entities/Board";
import { BoardRepository } from "../repositories/BoardRepository";

@Service()
export class BoardService {
    constructor(@InjectRepository() private boardRepository: BoardRepository) { }

    /**
     * 게시판 목록 조회
     */
    public async getList(page: number): Promise<Board[]> {
        return await this.boardRepository.find({
            skip: page - 1,
            take: 10,
            select: ["id", "title", "content"],
            relations: ["user"]
        })
    }
}