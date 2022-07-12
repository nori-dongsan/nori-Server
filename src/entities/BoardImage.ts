import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./Board";

@Entity({ name: "board_image" })
export class BoardImage {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: "image_link" })
  imageLink: string;

  @ManyToOne(() => Board, (board) => board.boardImages, {
    onDelete: "CASCADE",
    nullable: false,
  })
  board: Board;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
