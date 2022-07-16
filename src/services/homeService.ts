import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ResponseHomeDto } from "../dtos/HomeDto";
import { ToyDto } from "../dtos/ToyDto";
import { Toy } from "../entities/Toy";
import { HomeRepository } from "../repositories/HomeRepository";

@Service()
export class HomeService {
  constructor(@InjectRepository() private homeRepository: HomeRepository) {}

  public async fetchList(): Promise<ResponseHomeDto> {
    let homeToys = new ResponseHomeDto()

    // TODO: 희지가 스프레드 시트 다 적으면 그에 맞게 데이터 넣기
    homeToys.trending = await this.fetchToys([0, 1, 2]);
    homeToys.noriPick = await this.fetchToys([0, 1, 2]);
    homeToys.senses = await this.fetchToys([0, 1, 2]);
    homeToys.smart = await this.fetchToys([0, 1, 2]);

    return homeToys;
  }

  // id값에 따라 장난감 리스트 반환
  private async fetchToys(ids: any[]): Promise<ToyDto[]> {
    const toys = await this.homeRepository.findByIds(ids, { 
      relations: ['toySites'], 
      select: ['image', 'toySite', 'title', 'price', 'month', 'link'] 
    });

    const toysDto = new Toy().toDto(toys)

    return toysDto
  }
}
