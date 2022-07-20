import { ToyDto } from './ToyDto';

/**
 * Collection Dto
 */
export class ResponseCollectionDto {
  public title?: string;

  public toyList?: ToyDto[] | null;
}
