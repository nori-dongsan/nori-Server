import { Service } from "typedi";
import { getConnection } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { BoardImageCreateDto } from "../dtos/BoardImageDto";
import { BoardImageRepository } from "../repositories/BoardImageRepository";
import { logger } from "../utils/Logger";

@Service()
export class BoardImageService {
    constructor(@InjectRepository() private boardImageRepository: BoardImageRepository) { }

    public async create(boardImageCreateDto: BoardImageCreateDto) {
        const queryRunner = await getConnection().createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const image = this.boardImageRepository.create(boardImageCreateDto)
            await this.boardImageRepository.save(image)
        } catch (err) {
            logger.error(err);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}