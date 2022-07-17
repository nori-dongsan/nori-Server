import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Toy } from './Toy';

@Entity({ name: 'toy_collection' })
export class ToyCollection {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'toy_collection', length: 20 })
  toyCollection: string;

  @OneToMany(() => Toy, (toy) => toy.toyCollection, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  toys: Toy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
