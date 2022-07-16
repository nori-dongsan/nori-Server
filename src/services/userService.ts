import { CreateUserDto } from "../dtos/UserDto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { getConnection } from "typeorm";
import { logger } from "../utils/Logger";

@Service()
export class UserService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}

  /**
   * 사용자를 생성한다.
   * @param createUserDto 사용자 생성 DTO
   */
  public async create(createUserDto: CreateUserDto) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newUser = await this.userRepository.save(
        new User().toEntity(createUserDto)
      );
      await queryRunner.commitTransaction();

      return newUser;
    } catch (err) {
      logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
