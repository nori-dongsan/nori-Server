import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Toy } from './Toy';

@Entity({ name: 'toy_category' })
export class ToyCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'category', length: 20 })
  category: string;

  @ManyToOne(() => Toy, (toy) => toy.toyCategories, {
    nullable: false,
  })
  toy: Toy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
