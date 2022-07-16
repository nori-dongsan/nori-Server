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
import { ToyDto } from '../dtos/ToyDto';
import { LikeToy } from './LikeToy';
import { ToyCategory } from './ToyCategory';
import { ToySite } from './ToySite';

@Entity({ name: 'toy' })
export class Toy {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ name: 'title' })
  title: string;

  @IsNotEmpty()
  @Column({ name: 'price' })
  price: string;

  @IsNotEmpty()
  @Column({ name: 'month' })
  month: number;

  @IsNotEmpty()
  @Column({ name: 'link' })
  link: string;

  @IsNotEmpty()
  @Column({ name: 'play_how' })
  playHow: string;

  @IsNotEmpty()
  @Column({ name: 'kind', length: 20 })
  kind: string;

  @IsNotEmpty()
  @Column({ name: 'collection', length: 20 })
  collection: string;

  @OneToMany(() => ToyCategory, (toyCategory) => toyCategory.toy, {
    cascade: true,
  })
  toyCategories: ToyCategory;

  @OneToMany(() => ToySite, (toySite) => toySite.toy, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  toySite: ToySite;

  @OneToMany(() => LikeToy, (likeToy) => likeToy.toy, {
    cascade: true,
  })
  likeToys: LikeToy;

  @IsNotEmpty()
  @Column({ name: 'image' })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toDto(toyEntity: Toy[]): ToyDto[] {
    const toys: ToyDto[] = [];

    for (const toy of toyEntity) {
      const toyDto = new ToyDto();

      toyDto.image = toy.image;
      toyDto.siteName = toy.toySite.toySite;
      toyDto.title = toy.title;
      toyDto.price = toy.price;
      toyDto.month = toy.month;
      toyDto.siteUrl = toy.link;

      toys.push(toyDto);
    }

    return toys;
  }
}
