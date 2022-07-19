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
import { ToySiteCreateDto } from '../dtos/ToySiteDto';
import { Toy } from './Toy';

@Entity({ name: 'toy_site' })
export class ToySite {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'toy_site', length: 20 })
  toySite: string;

  @OneToMany(() => Toy, (toy) => toy.toySite, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  toys: Toy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toEntity(toySiteCreateDto: ToySiteCreateDto) {
    const toySite = new ToySite();
    toySite.toySite = toySiteCreateDto.site;
    toySite.toys = toySiteCreateDto.toys;
    return toySite;
  }
}
