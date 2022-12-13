// src/users/usersController.ts
import { Context, ContextWithBody } from "cloudworker-router";
import { Env } from "../types/Env";
import { getDb } from "../services/db";
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa-workers";

import { User } from "./user";
import { UsersService, UserCreationParams } from "./usersService";

interface Tmp {
  ctx: ContextWithBody<Env>;
}

@Route("users")
@Tags("users")
export class UsersController extends Controller {
  @Get("")
  public async getUsers(@Request() request: any): Promise<User[]> {
    const db = getDb(request.ctx);

    return new UsersService(db).list();
  }

  @Get("{userId}")
  public async getUser(
    @Path() userId: number,
    @Request() request: any
  ): Promise<User> {
    const db = getDb(request.ctx);

    return new UsersService(db).get(userId);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams,
    @Request() request: Tmp
  ): Promise<Response> {
    const db = getDb(request.ctx);

    const result = await new UsersService(db).create(requestBody);
    this.setStatus(201); // set return status 201
    return new Response(JSON.stringify(result));
  }
}
