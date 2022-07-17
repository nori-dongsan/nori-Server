import { Connection } from "typeorm"
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { BoardRepository } from "../../../src/repositories/BoardRepository"
import { BoardService } from "../../../src/services/BoardService"

describe("BoardService", () => {
    let db: Connection;
    let boardRepository: BoardRepository;
    let boardService: BoardService;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        boardRepository = db.getCustomRepository(BoardRepository)
        await boardRepository.save(BoardSeed);
        boardService = new BoardService(boardRepository);
    });

    afterAll(() => db.close());

    it("전체 게시물 리스트를 조회한다.", async () => {
        const boards = await boardService.getList();
        expect(boards).toBe(BoardSeed)
    })

    // TODO P3 필터링
})