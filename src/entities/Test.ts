import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "test" })
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: "sns_id", length: 50 })
  snsId: string;

  @IsNotEmpty()
  @Column({ name: "nickname", length: 20 })
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

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
