import { Connection } from "typeorm"
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { BoardRepository } from "../../../src/repositories/BoardRepository"
import { BoardService } from "../../../src/services/BoardService"
import { BoardSeed } from "../../utils/seeds/BoardTestSeed";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { Board } from "../../../src/entities/Board";

describe("BoardService", () => {
    let db: Connection;
    let boardRepository: BoardRepository;
    let userRepository: UserRepository;
    let boardService: BoardService;


    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository)
        await userRepository.save(UserSeed);
        boardRepository = db.getCustomRepository(BoardRepository)
        await boardRepository.save(BoardSeed);
        boardService = new BoardService(boardRepository);
    });

    afterAll(() => db.close());

    it("전체 게시물 리스트를 조회한다.", async () => {
        const boards = await boardService.getList();
        const boardDtos = boards.map((value: Board) => {
            const boardDto = {
                id: value.id,
                section: value.section,
                title: value.title,
                content: value.content,
                createdAt: value.createdAt,
                updatedAt: value.updatedAt
            }
            return boardDto
        })
        expect(boardDtos).toEqual([
            {
                id: 4,
                section: '',
                title: 'test',
                content: 'testtest',
                createdAt: new Date("2022-07-16T00:07:46.889Z"),
                updatedAt: new Date("2022-07-16T00:07:46.889Z")
            }
        ])
    })



})