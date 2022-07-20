import { Connection } from "typeorm"
import { BoardCommentRepository } from "../../../src/repositories/BoardCommentRepository"
import { UserRepository } from "../../../src/repositories/UserRepository";
import { BoardService } from "../../../src/services/BoardService";
import { createMemoryDatabase } from "../../utils/CreateMemoryDatabase";
import { UserSeed } from "../../utils/seeds/UserTestSeed";
import { BoardCommentService } from "../../../src/services/BoardCommentService"
import { BoardRepository } from "../../../src/repositories/BoardRepository";
import { BoardSeed } from "../../utils/seeds/BoardTestSeed";
import { UserService } from "../../../src/services/UserService"
import { BoardCommentCreateDto } from "../../../src/dtos/BoardCommentDto";

describe("BoardCommentService", () => {
    let db: Connection;
    let boardCommentRepository: BoardCommentRepository;
    let userRepository: UserRepository;
    let boardCommentService: BoardCommentService;
    let boardService: BoardService;
    let boardRepository: BoardRepository;
    let userService: UserService;

    beforeAll(async () => {
        db = await createMemoryDatabase();
        userRepository = db.getCustomRepository(UserRepository);
        await userRepository.save(UserSeed);
        boardRepository = db.getCustomRepository(BoardRepository);
        await boardRepository.save(BoardSeed);
        boardCommentRepository = db.getCustomRepository(BoardCommentRepository);
        userService = new UserService(userRepository);
        boardService = new BoardService(boardRepository);
        boardCommentService = new BoardCommentService(boardCommentRepository);
    })

    afterAll(() => db.close());

    const boardId = 4
    const userId = 1

    it("댓글 생성", async () => {
        const board = await boardService.get(boardId)
        const user = await userService.getUser(userId)
        const commentCreateDto = new BoardCommentCreateDto
        commentCreateDto.board = board!
        commentCreateDto.user = user!
        commentCreateDto.content = "test"

        await boardCommentService.create(commentCreateDto)

        const comment = await boardCommentService.getListByBoard(board!)
        const commentDto = comment?.map((value) => {
            return {
                id: value.id,
                content: value.content,
                createAt: `2022-07-20T16:13:28.000Z`,
                updateAt: `2022-07-20T16:13:28.000Z`,
                userId: value.user.id
            }
        })
        expect(commentDto).toEqual([{
            id: 1,
            content: 'test',
            createAt: '2022-07-20T16:13:28.000Z',
            updateAt: '2022-07-20T16:13:28.000Z',
            userId: 1
        }])
    })
})