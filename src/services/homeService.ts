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
    const trending = await this.homeRepository.findByIds([0, 1, 2]);
    const noriPick = await this.homeRepository.findByIds([0, 1, 2]);
    const senses = await this.homeRepository.findByIds([0, 1, 2]);
    const smart = await this.homeRepository.findByIds([0, 1, 2]);

    let homeToys = new ResponseHomeDto()
    // TODO: homeToys에 형식에 맞게 데이터 넣기

    return homeToys;
  }
}
