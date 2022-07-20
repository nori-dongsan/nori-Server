import { CreateUserDto, UserDto } from '../dtos/UserDto';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { getConnection } from 'typeorm';
import { logger } from '../utils/Logger';

@Service()
export class UserService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}

  /**
   * 사용자를 생성한다.
   * @param createUserDto 사용자 생성 DTO
   */
  public async create(createUserDto: CreateUserDto) {
    const queryRunner = await getConnection().createQueryRunner();

    await queryRunner.connect();
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

  public async getUser(userId: number) {
    try {
      const user = await this.userRepository.findOne({ id: userId });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * 닉네임으로 사용자를 조회한다.
   * @param nickname 유저 닉네임
   */
  public async findByNickname(nickname: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          nickname: nickname,
        },
      });

      if (user) {
        return user;
      }

      return null;
    } catch (err) {
      logger.error(err);
    }
  }

  /**
   * 사용자 닉네임을 업데이트한다.
   * @param id 유저 아이디
   * @param nickname 업데이트될 유저 닉네임
   */
  public async updateNickname(id: number, nickname: string) {
    const queryRunner = await getConnection().createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        User,
        {
          id: id,
        },
        {
          nickname: nickname,
        }
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      logger.error(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  public async get(id: number): Promise<UserDto | undefined> {
    try {
      const user = await this.userRepository.findOne({ id: id });
      if (user) {
        const userDto = new UserDto(user);
        return userDto;
      }
    } catch (err) {
      logger.error(err);
    }
  }
}
