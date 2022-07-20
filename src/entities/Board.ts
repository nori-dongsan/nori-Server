import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BoardCommentResponseDto } from "../dtos/BoardComment";
import { BoardDto } from "../dtos/BoardDto";
import { BoardCreateDto } from "../dtos/BoardDto";
import { BoardComment } from "./BoardComment";
import { BoardImage } from "./BoardImage";
import { User } from "./User";


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
}

  public toEntity(boardCreateDto: BoardCreateDto) {
    const board = new Board()
    board.title = boardCreateDto.title
    board.content = boardCreateDto.content
    board.user = boardCreateDto.user
  }
}
