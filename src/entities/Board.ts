import { IsNotEmpty } from 'class-validator';
import { AnyNsRecord } from 'dns';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BoardCommentResponseDto } from '../dtos/BoardComment';
import { BoardDto } from '../dtos/BoardDto';
import { BoardCreateDto } from '../dtos/BoardDto';
import { BoardComment } from './BoardComment';
import { BoardImage } from './BoardImage';
import { User } from './User';

@Entity({ name: 'board' })
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'section', length: 20 })
  section: string;

  @IsNotEmpty()
  @Column({ name: 'title', length: 50 })
  title: string;

  @IsNotEmpty()
  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @OneToMany(() => BoardComment, (boardComment) => boardComment.board, {
    cascade: true,
  })
  boardComments: BoardComment[];

  @OneToMany(() => BoardImage, (boardImages) => boardImages.board, {
    cascade: true,
  })
  boardImages: BoardImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toEntity(boardCreateDto: BoardCreateDto) {
    const board = new Board();
    board.title = boardCreateDto.title;
    board.content = boardCreateDto.content;
    board.user = boardCreateDto.user;
  }

  public toDto(boardEntity: any): BoardDto[] {
    const boards: BoardDto[] = [];

    for (const board of boardEntity) {
      const boardDto = new BoardDto();

      boardDto.id = board.id;
      boardDto.category = board.section;
      boardDto.title = board.title;
      boardDto.content = board.content;
      boardDto.userNickname = board.user.nickname;
      boardDto.replyCount = board.boardComments.length;
      boardDto.createdAt = board.createdAt;
      boardDto.image =
        board.boardImages.length != 0 ? board.boardImages[0].imageLink : null;

      boards.push(boardDto);
    }

    return boards;
  }
}
