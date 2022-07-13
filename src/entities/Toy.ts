import { IsNotEmpty } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LikeToy } from "./LikeToy";
import { ToyCategory } from "./ToyCategory";
import { ToySite } from "./ToySite";

@Entity({ name: "toy" })
export class Toy {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: "title" })
  title: string;

  @IsNotEmpty()
  @Column({ name: "price" })
  price: string;

  @IsNotEmpty()
  @Column({ name: "month" })
  month: number;

  @IsNotEmpty()
  @Column({ name: "link" })
  link: string;

  @IsNotEmpty()
  @Column({ name: "play_how" })
  playHow: string;

  @IsNotEmpty()
  @Column({ name: "kind", length: 20 })
  kind: string;

  @IsNotEmpty()
  @Column({ name: "collection", length: 20 })
  collection: string;

  @OneToMany(() => ToyCategory, (toyCategory) => toyCategory.toy, {
    cascade: true,
  })
  toyCategorys: ToyCategory;

  @OneToMany(() => ToySite, (toySite) => toySite.toy, {
    onDelete: "CASCADE",
    nullable: false,
  })
  toySites: ToySite;

  @OneToMany(() => LikeToy, (likeToy) => likeToy.toy, {
    cascade: true,
  })
  likeToys: LikeToy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
