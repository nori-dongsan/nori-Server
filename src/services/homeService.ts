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

    // TODO: 희지가 스프레드 시트 다 적으면 그에 맞게 데이터 넣기
    homeToys.trending = await this.fetchToys([1193, 1269, 1028, 1194]);
    homeToys.theme = await this.fetchThemes();
    homeToys.noriPick = await this.fetchToys([1233, 1431, 1339, 1276]);
    homeToys.senses = await this.fetchToys([1081, 1356, 1311, 1308]);
    homeToys.smart = await this.fetchToys([1032, 1191, 1159, 1169]);

    return homeToys;
  }

  // id값에 따라 장난감 리스트 반환
  private async fetchToys(ids: any[]): Promise<ToyDto[] | null> {
    try {
      const toys = await this.homeRepository
        .createQueryBuilder('toy')
        .leftJoinAndMapOne(
          'toy.toySiteCd',
          ToySite,
          'toySite',
          'toy.toySiteCd = toySite.id'
        )
        .whereInIds(ids)
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
