import { Connection } from "typeorm"
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { BoardRepository } from "../../../src/repositories/BoardRepository"
import { BoardService } from "../../../src/services/BoardService"
import { BoardSeed } from "../../utils/seeds/BoardTestSeed";
import { UserRepository } from "../../../src/repositories/UserRepository";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { Board } from "../../../src/entities/Board";
import { BoardDto, BoardPutDto } from "../../../src/dtos/BoardDto";

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
        const boardDtos = boards.map((value) => {
            const boardDto = {
                id: value.id,
                section: value.category,
                title: value.title,
                content: value.content,
            }
            return boardDto
        })
        expect(boardDtos).toEqual([
            {
                id: 4,
                section: "",
                title: 'test',
                content: 'testtest',
            }
        ])
    })

    const boardId = 4

    it("게시물 조회", async () => {
        const board = await boardService.get(boardId)
        const boardDto = new BoardDto()
        if (board) {
            boardDto.author = false
            boardDto.title = board.title
            boardDto.content = board.content
        }
        expect(boardDto).toEqual({
            author: false,
            title: 'test',
            content: 'testtest',
            replyCount: 0,
            likeCount: 0
        })
    })

    it("게시물 수정", async () => {
        const boardPutDto = new BoardPutDto()
        boardPutDto.boardId = boardId
        boardPutDto.content = 'test2'
        boardPutDto.title = 'title2'
        await boardService.put(boardPutDto)
        const board = await boardService.get(boardId)
        const boardDto = new BoardDto()
        if (board) {
            boardDto.author = false
            boardDto.title = board.title
            boardDto.content = board.content
        }
        expect(boardDto).toEqual({
            author: false,
            title: 'title2',
            content: 'test2',
            replyCount: 0,
            likeCount: 0
        })
    })

    it("게시물 삭제", async () => {
        await boardService.delete(boardId)
        const board = await boardService.get(boardId)
        expect(board).toEqual(undefined)
    })
})