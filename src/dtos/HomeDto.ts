import { ToyDto } from './ToyDto';

/**
 * Home Response Dto
 */
export class ResponseHomeDto {
  public trending?: ToyDto[] | null;

  public theme?: ThemeDto[] | null;

  public noriPick?: ToyDto[] | null;

  public senses?: ToyDto[] | null;

  public smart?: ToyDto[] | null;
}

export class ThemeDto {
  public id: number;

  public image: string;

  public subtitle: string;

  public title: string;
}
