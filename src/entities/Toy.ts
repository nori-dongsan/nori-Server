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
import { ToyCollection } from './ToyCollection';
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
  price: number;

  @IsNotEmpty()
  @Column({ name: 'price_cd' })
  priceCd: number;

  @IsNotEmpty()
  @Column({ name: 'month' })
  month: string;

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

  @ManyToOne(() => ToyCollection, (ToyCollection) => ToyCollection.toys, {
    cascade: true,
  })
  toyCollection: ToyCollection;

  @OneToMany(() => ToyCategory, (toyCategory) => toyCategory.toy, {
    cascade: true,
  })
  toyCategories: ToyCategory;

  @IsNotEmpty()
  @Column({ name: 'category' })
  category: string;

  @IsNotEmpty()
  @Column({ name: 'category_cd' })
  categoryCd: number;

  @ManyToOne(() => ToySite, (toySite) => toySite.toys, {
    onDelete: 'CASCADE',
    // nullable: false,
  })
  toySite: ToySite;

  @ManyToOne(() => ToySite, (toySite) => toySite.toys, {
    onDelete: 'CASCADE',
  })
  @IsNotEmpty()
  @Column({ name: 'toy_site_cd' })
  toySiteCd: number;

  @OneToMany(() => LikeToy, (likeToy) => likeToy.toy, {
    cascade: true,
  })
  likeToys: LikeToy;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  public toDto(toyEntity: any): ToyDto[] {
    console.log('>>>>>>>> toy', toyEntity);
    const toys: ToyDto[] = [];

    for (const toy of toyEntity) {
      const toyDto = new ToyDto();

      toyDto.image = toy.image;
      // toyDto.siteName = toy.toySite.toySite;
      toyDto.title = toy.title;
      toyDto.price = toy.price;
      toyDto.month = toy.month;
      toyDto.siteUrl = toy.link;

      toys.push(toyDto);
    }

    return toys;
  }
}
