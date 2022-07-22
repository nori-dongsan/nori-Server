import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { BoardDto, BoardCreateDto, BoardPutDto } from '../dtos/BoardDto';
import { Board } from '../entities/Board';
import { BoardRepository } from '../repositories/BoardRepository';
import { logger } from '../utils/Logger';

@Service()
export class BoardService {
  constructor(@InjectRepository() private boardRepository: BoardRepository) { }

  /**
   * 게시판 목록 조회
   */
  public async getList(): Promise<BoardDto[]> {
    const boards = await this.boardRepository.find({
      relations: ['user', 'boardComments', 'boardImages'],
    });

    //TODO: 지금은 replyCount를 db 데이터 다 받아온 후에 우리 로직에서 (배열).length하는 방법으로 하고 있는데, query에서 count() 쓰는 코드로 변경 필요 -> query builder 써야 해서 임시로 이렇게 작성 해놓음

    const boardsDto = new Board().toDto(boards);

    return boardsDto;
  }
  /**
   * 게시물 조회
   * @param boardId
   */
  public async get(boardId: number): Promise<Board | undefined> {
    try {
      const board = await this.boardRepository.findOne(
        { id: boardId },
        { relations: ['boardImages', 'boardComments', 'user'] }
      );
      return board;
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * 게시글 작성
   * @param boardCreateDto 게시판 생성 DTO
   */
  public async create(boardCreateDto: BoardCreateDto) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const board = this.boardRepository.create(boardCreateDto);
      await queryRunner.manager.save(board);
      await queryRunner.commitTransaction();
      return board;
    } catch (err) {
      logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 삭제
   * @param boardId
   */
  public async delete(boardId: number) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // await this.boardRepository.delete({ id: boardId });
      const board = await queryRunner.manager.findByIds(Board, [boardId]);
      await queryRunner.manager.remove(board)
      await queryRunner.commitTransaction();
    } catch (err) {
      logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 수정
   * @param boardPutDto
   */
  public async put(boardPutDto: BoardPutDto) {
    try {
      await this.boardRepository.update(boardPutDto.boardId, {
        content: boardPutDto.content,
        title: boardPutDto.title,
        section: boardPutDto.section
      });
    } catch (err) {
      logger.error(err);
    }
  }
}
