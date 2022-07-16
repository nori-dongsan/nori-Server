import { IsNotEmpty } from 'class-validator';
import { Toy } from '../entities/Toy';

/**
 * 장난감 Dto
 */
export class ToyDto {
  @IsNotEmpty()
  public image: string;

  @IsNotEmpty()
  public siteName: string;

  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public price: string;

  @IsNotEmpty()
  public month: number;

  @IsNotEmpty()
  public siteUrl: string;
}
