// src/users/usersController.ts
import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";
import { User } from "../entities/User";
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { UsersService } from "../services/UserService";
import { UserCreateDto } from "../interfaces/test/UserCreateDto";
import { PostBaseResponseDto } from "../interfaces/common/PostBaseResponseDto";
import { wrapSuccess } from "../utils/success";

@Route("test")
@Tags("Test")
@fluentProvide(UsersController).done()
export class UsersController extends Controller {
  constructor(@inject(UsersService) private userService: UsersService) {
    super();
  }

  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() firstName: string,
    @Query() lastName: string
  ): Promise<User> {
    return this.userService.get(userId, firstName, lastName);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreateDto
  ): Promise<PostBaseResponseDto> {
    this.setStatus(201); // set return status 201
    const newUser = this.userService.create(requestBody);
    return wrapSuccess(newUser, "회원가입 성공", 201);
  }
}
