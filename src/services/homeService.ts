import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ResponseHomeDto, ThemeDto } from '../dtos/HomeDto';
import { ToyDto } from '../dtos/ToyDto';
import { Toy } from '../entities/Toy';
import { HomeRepository } from '../repositories/HomeRepository';
import { logger } from '../utils/Logger';

@Service()
export class HomeService {
  constructor(@InjectRepository() private homeRepository: HomeRepository) {}

  public async fetchList(): Promise<ResponseHomeDto> {
    let homeToys = new ResponseHomeDto();

    // TODO: 희지가 스프레드 시트 다 적으면 그에 맞게 데이터 넣기
    homeToys.trending = await this.fetchToys([0, 1, 2]);
    homeToys.theme = await this.fetchThemes();
    homeToys.noriPick = await this.fetchToys([0, 1, 2, 3]);
    homeToys.senses = await this.fetchToys([0, 1, 2, 3]);
    homeToys.smart = await this.fetchToys([0, 1, 2, 3]);

    return homeToys;
  }

  // id값에 따라 장난감 리스트 반환
  private async fetchToys(ids: any[]): Promise<ToyDto[] | null> {
    try {
      const toys = await this.homeRepository.findByIds(ids, {
        relations: ['toySite'],
        select: ['image', 'toySiteCd', 'title', 'price', 'month', 'link'],
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

  private fetchThemes(): ThemeDto[] {
    const themes: ThemeDto[] = [];

    // TODO: 희지가 스프레드 시트에 넣어주면 자동 업데이트 연동하거나 직접 값 없데이트 하기
    const theme = new ThemeDto();
    theme.id = 0;
    theme.image = '';
    theme.title = '우리아이 걸음마를 위한';
    theme.subtitle = '쏘서, 보행기 모음';
    themes.push(theme);

    theme.id = 1;
    theme.image = '';
    theme.title = '오감 발달 아이들이 좋아하는';
    theme.subtitle = '주방놀이 세트';
    themes.push(theme);

    theme.id = 2;
    theme.image = '';
    theme.title = '친구들과 함께';
    theme.subtitle = '다인원 장난감 추천';
    themes.push(theme);

    return themes;
  }
}
