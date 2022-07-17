import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ToyCreateDto } from "../dtos/ToyDto";
import { ToyRepository } from "../repositories/ToyRepository";

@Service()
export class ToyService {
    constructor(@InjectRepository() private toyRepository: ToyRepository) { }

    public async create(createDto: ToyCreateDto) {
        const toy = this.toyRepository.create(createDto)
        await this.toyRepository.save(toy)
        return toy
    }
}