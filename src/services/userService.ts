import { CreateUserDto } from "../dtos/UserDto";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class UserService {
  constructor(@InjectRepository() private userRepository: UserRepository) {}

  /**
   * 사용자를 생성한다.
   * @param createUserDto 사용자 생성 DTO
   */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = createUserDto.toEntity();
    const newUser = await this.userRepository.save(user);

    return newUser;
  }
}
