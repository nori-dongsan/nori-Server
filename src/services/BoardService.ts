import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Board } from "../entities/Board";
import { BoardRepository } from "../repositories/BoardRepository";

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
}