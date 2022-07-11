// src/users/usersController.ts
import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";
import { Body, Controller, Post, Route, SuccessResponse, Tags } from "tsoa";
import { TestService } from "../services/userService";
import { TestCreateDto } from "../interfaces/test/UserCreateDto";
import { PostBaseResponseDto } from "../interfaces/common/PostBaseResponseDto";
import { wrapSuccess } from "../utils/success";

@Route("test")
@Tags("Test")
@fluentProvide(TestController).done()
export class TestController extends Controller {
  constructor(@inject(TestService) private userService: TestService) {
    super();
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: TestCreateDto
  ): Promise<PostBaseResponseDto> {
    this.setStatus(201); // set return status 201
    const newUser = this.userService.create(requestBody);
    return wrapSuccess(newUser, "회원가입 성공", 201);
  }
}
