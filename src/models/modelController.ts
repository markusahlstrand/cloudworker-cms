// src/Models/ModelsController.ts
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
} from "tsoa-workers";

import { Model } from "./model";
import { ModelsService, ModelCreationParams } from "./modelsService";

interface Tmp {
  ctx: ContextWithBody<Env>;
}

@Route("models")
export class ModelsController extends Controller {
  @Get("")
  /**
   * This is a Model
   */
  public async listModels(@Request() request: any): Promise<Model[]> {
    const db = getDb(request.ctx);

    return new ModelsService(db).list();
  }

  @Get("{id}")
  public async getModel(
    @Path() id: number,
    @Request() request: any
  ): Promise<Model> {
    const db = getDb(request.ctx);

    return new ModelsService(db).get(id);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createModel(
    @Body() requestBody: ModelCreationParams,
    @Request() request: Tmp
  ): Promise<Response> {
    const db = getDb(request.ctx);

    const result = await new ModelsService(db).create(requestBody);
    this.setStatus(201); // set return status 201
    return new Response(JSON.stringify(result));
  }
}
