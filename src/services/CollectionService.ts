import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ResponseCollectionDto } from '../dtos/CollectionDto';
import { ToyDto } from '../dtos/ToyDto';
import { Toy } from '../entities/Toy';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { logger } from '../utils/Logger';

@Service()
export class CollectionService {
  constructor(
    @InjectRepository() private collectionRepository: CollectionRepository
  ) {}

  public async fetchList(
    themeId: number,
    sort: string | null
  ): Promise<ResponseCollectionDto> {
    let collection = new ResponseCollectionDto();

    collection.title = '';
    collection.toyList = await this.fetchToys(
      themeId,
      this.translateOrder(sort)
    );

    return collection;
  }

  private async fetchToys(
    themeId: number,
    order: 'ASC' | 'DESC'
  ): Promise<ToyDto[] | null> {
    try {
      const toys = await this.collectionRepository.find({
        relations: ['toySite', 'toyCollection'],
        select: ['image', 'toySite', 'title', 'price', 'month', 'link'],
        where: { toyCollection: { id: themeId } },
        order: { price: order },
      });

      // 빈 배열이면 null 반환
      if (toys.length === 0) {
        return null;
      } else {
        const toysDto = new Toy().toDto(toys);
        return toysDto;
      }
    } catch (err) {
      logger.error(err);

      return null;
    }
  }

  // query param으로 들어온 string -> sql order 변환
  private translateOrder(sort: string | null): 'ASC' | 'DESC' {
    if (sort?.includes('desc')) {
      return 'DESC';
    }
    return 'ASC';
  }
}
