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
  @Column({ name: 'price_cd' })
  priceCd: number;

  @IsNotEmpty()
  @Column({ name: 'month' })
  month: number;

  @IsNotEmpty()
  @Column({ name: 'min_month' })
  minMonth: number;

  @IsNotEmpty()
  @Column({ name: 'max_month' })
  maxMonth: number;

  @IsNotEmpty()
  @Column({ name: 'link' })
  link: string;

  @IsNotEmpty()
  @Column({ name: 'play_how' })
  playHow: string;

  @IsNotEmpty()
  @Column({ name: 'play_how_cd' })
  playHowCd: number;

  @IsNotEmpty()
  @Column({ name: 'image' })
  image: string;

  @IsNotEmpty()
  @Column({ name: 'collection', length: 20 })
  collection: string;

  @OneToMany(() => ToyCategory, (toyCategory) => toyCategory.toy, {
    cascade: true,
  })
  toyCategories: ToyCategory;

  @ManyToOne(() => ToySite, (toySite) => toySite.toys, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  toySite: ToySite;

  @OneToMany(() => LikeToy, (likeToy) => likeToy.toy, {
    cascade: true,
  })
  likeToys: LikeToy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
