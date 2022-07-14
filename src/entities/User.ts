import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./Board";
import { BoardComment } from "./BoardComment";
import { LikeToy } from "./LikeToy";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: "sns_id", length: 50 })
  snsId: string;

  @Column({ name: "nickname", length: 20, nullable: true })
  nickname: string;

  @IsNotEmpty()
  @Column({ name: "is_deleted", width: 1, default: false })
  isDeleted: boolean;

  @IsNotEmpty()
  @Column({ name: "provider", length: 20 })
  provider: string;

  @IsNotEmpty()
  @Column({ name: "email" })
  email: string;

  @Column({ name: "refresh_token", nullable: true, select: false })
  refreshToekn: string;

  @OneToMany(() => Board, (board) => board.user, {
    cascade: true,
  })
  boards: Board;

  @OneToMany(() => BoardComment, (boardComment) => boardComment.user, {
    cascade: true,
  })
  boardCommtents: BoardComment;

  @OneToMany(() => LikeToy, (likeToy) => likeToy.user, {
    cascade: true,
  })
  likeToys: LikeToy;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
