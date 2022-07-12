import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Toy } from "./Toy";
import { User } from "./User";

@Entity({ name: "like_toy" })
export class LikeToy {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likeToys, {
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Toy, (toy) => toy.likeToys, {
    onDelete: "CASCADE",
    nullable: false,
  })
  toy: Toy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
