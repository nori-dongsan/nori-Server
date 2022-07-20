import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ResponseCollectionDto } from '../dtos/CollectionDto';
import { ToyDto } from '../dtos/ToyDto';
import { Toy } from '../entities/Toy';
import { ToyCollection } from '../entities/ToyCollection';
import { ToySite } from '../entities/ToySite';
import { CollectionRepository } from '../repositories/CollectionRepository';
import { ThemeRepository } from '../repositories/ThemeRepository';
import { logger } from '../utils/Logger';

@Service()
export class CollectionService {
  constructor(
    @InjectRepository() private collectionRepository: CollectionRepository,
    @InjectRepository() private themeRepository: ThemeRepository
  ) {}

  public async fetchList(
    themeId: number,
    sort: string | null
  ): Promise<ResponseCollectionDto> {
    let collection = new ResponseCollectionDto();

    collection.title = await this.fetchTitle(themeId);
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
      const toys = await this.collectionRepository
        .createQueryBuilder('toy')
        .leftJoinAndMapOne(
          'toy.toySiteCd',
          ToySite,
          'toySite',
          'toy.toySiteCd = toySite.id'
        )
        .leftJoinAndMapOne(
          'toy.toyCollectionId',
          ToyCollection,
          'toyCollection',
          'toy.toyCollectionId = toyCollection.id'
        )
        .where('toyCollection.id = :themeId', { themeId: themeId })
        .orderBy('toy.price', order)
        .getMany();

      // 빈 배열이면 null 반환
      if (!toys) {
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

  private async fetchTitle(themeId: number): Promise<string> {
    try {
      const title = await this.themeRepository.findOne({
        where: { id: themeId },
      });

      console.log(title);
      const titleStr = new ToyCollection().toTitleString(title);

      return titleStr;
    } catch (err) {
      logger.error(err);

      return '';
    }
  }
}
