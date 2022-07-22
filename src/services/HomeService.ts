import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ResponseHomeDto, ThemeDto } from '../dtos/HomeDto';
import { ToyDto } from '../dtos/ToyDto';
import { Toy } from '../entities/Toy';
import { ToySite } from '../entities/ToySite';
import { HomeRepository } from '../repositories/HomeRepository';
import { ThemeRepository } from '../repositories/ThemeRepository';
import { logger } from '../utils/Logger';

@Service()
export class HomeService {
  constructor(
    @InjectRepository() private homeRepository: HomeRepository,
    @InjectRepository() private themeRepository: ThemeRepository
  ) {}

  public async fetchList(): Promise<ResponseHomeDto> {
    let homeToys = new ResponseHomeDto();

    homeToys.trending = await this.fetchToys(1001);
    homeToys.theme = await this.fetchThemes();
    homeToys.noriPick = await this.fetchToys(1002);
    homeToys.senses = await this.fetchToys(1003);
    homeToys.smart = await this.fetchToys(1004);

    return homeToys;
  }

  // id값에 따라 장난감 리스트 반환
  private async fetchToys(id: number): Promise<ToyDto[] | null> {
    try {
      const toys = await this.homeRepository
        .createQueryBuilder('toy')
        .leftJoinAndMapOne(
          'toy.toySiteCd',
          ToySite,
          'toySite',
          'toy.toySiteCd = toySite.id'
        )
        .where('toyCollectionId = :id', { id: id })
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

  // 테마별 노리잇템 리스트 반환
  private async fetchThemes(): Promise<ThemeDto[]> {
    try {
      const themes = await this.themeRepository.findByIds([2, 3, 4], {
        select: ['id', 'title', 'subtitle', 'image'],
      });

      return themes;
    } catch (err) {
      logger.error(err);

      return [];
    }
  }
}
