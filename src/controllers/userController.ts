// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from "tsoa";
import { User } from "../models/user";
import { UsersService, UserCreationParams } from "../services/userService";

@Route("test")
export class UsersController extends Controller {
  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Query() firstName: string,
    @Query() lastName: string
  ): Promise<User> {
    return new UsersService().get(userId, firstName, lastName);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<User> {
    this.setStatus(201); // set return status 201
    const newUser = new UsersService().create(requestBody);
    return newUser;
  }
}
