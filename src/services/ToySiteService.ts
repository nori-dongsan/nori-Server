import { Service } from "typedi/decorators/Service"
import { InjectRepository } from "typeorm-typedi-extensions"
import { ToySiteCreateDto } from "../dtos/ToySiteDto"
import { ToySiteRepository } from "../repositories/ToySiteRepository"

@Service()
export class ToySiteService {
    constructor(@InjectRepository() private toySiteRepository: ToySiteRepository) { }

    public async create(createDto: ToySiteCreateDto) {
        const toySite = this.toySiteRepository.create(createDto)
        await this.toySiteRepository.save(toySite)
        return toySite
    }
}