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
  Middlewares,
  Tags,
  Patch,
} from "tsoa-workers";

import { Model } from "./model";
import { ModelsService, ModelCreationParams } from "./modelsService";
import corsMiddleware from "../middlewares/cors";

interface RequestWithContext {
  ctx: ContextWithBody<Env>;
}

@Route("models")
@Tags("models")
export class ModelsController extends Controller {
  @Get("")
  @Middlewares(corsMiddleware)
  public async listModels(@Request() request: any): Promise<Model[]> {
    const db = getDb(request.ctx);

    return new ModelsService(db).list();
  }

  @Get("{id}")
  @Middlewares(corsMiddleware)
  public async getModel(
    @Path() id: number,
    @Request() request: any
  ): Promise<Model> {
    const db = getDb(request.ctx);

    return new ModelsService(db).get(id);
  }

  @Patch("{id}")
  @Middlewares(corsMiddleware)
  public async updateModel(
    @Body() requestBody: ModelCreationParams,
    @Path() id: number,
    @Request() request: any
  ): Promise<number> {
    const db = getDb(request.ctx);

    return new ModelsService(db).patch(id, requestBody);
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Middlewares(corsMiddleware)
  public async createModel(
    @Body() requestBody: ModelCreationParams,
    @Request() request: RequestWithContext
  ): Promise<Response> {
    const db = getDb(request.ctx);

    const result = await new ModelsService(db).create(requestBody);
    this.setStatus(201); // set return status 201
    return new Response(JSON.stringify(result));
  }
}
