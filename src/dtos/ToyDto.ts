import { IsNotEmpty } from 'class-validator';
import { Toy } from '../entities/Toy';
import { ToySite } from '../entities/ToySite';

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
    public price: number;

    @IsNotEmpty()
    public month: string;

    @IsNotEmpty()
    public siteUrl: string;
}

export class ToyCreateDto {
    title: string;
    price: number;
    priceCd: number;
    month: string;
    minMonth: number;
    maxMonth: number;
    playHow: string;
    playHowCd: number;
    image: string;
    category: string;
    categoryCd: number;
    toySiteCd: number;
    link: string;
}