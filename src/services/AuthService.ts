import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { logger } from '../utils/Logger';

@Service()
export class AuthService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}

  /**
   * 사용자 정보가 유효한지 확인하고 유효하면 사용자 정보를 반환한다.
   * @param snsId
   */
  public async validateUserBySnsId(snsId: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          snsId: snsId,
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
   * RefreshToken을 데이터베이스에 저장한다.
   * @param user User
   * @param token RefreshToken
   */
  public async saveRefreshToken(user: User, token: string) {
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    try {
      user.refreshToken = token;
      await this.userRepository.update(
        {
          snsId: user.snsId,
        },
        {
          refreshToken: user.refreshToken,
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

  /**
   * RefreshToken이 일치하는 사용자 정보를 반환한다.
   * @param id 사용자 id
   * @param refreshToken RefreshToken
   */
  public async validateUserToken(id: string, refreshToken: string) {
    try {
      const user = await this.userRepository.findOne({
        select: ['id', 'snsId'],
        where: {
          id: id,
          refreshToken: refreshToken,
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
}
