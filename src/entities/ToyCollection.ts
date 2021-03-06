import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
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
  @Column({ name: 'title', length: 20 })
  title: string;

  @OneToMany(() => Toy, (toy) => toy.toyCollection, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  toys: Toy;

  @IsNotEmpty()
  @Column({ name: 'image' })
  image: string;

  @IsNotEmpty()
  @Column({ name: 'subtitle' })
  subtitle: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toTitleString(themeEntity: any): string {
    const theme = themeEntity.title;

    return theme;
  }
}
