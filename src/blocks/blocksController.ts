// src/Blocks/BlocksController.ts
import { ContextWithBody } from "cloudworker-router";
import { Env } from "../types/Env";
import { getDb } from "../services/db";
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa-workers";

import { Block } from "./block";
import { BlocksService, BlockCreationParams } from "./blocksService";
import corsMiddleware from "../middlewares/cors";

interface Tmp {
  ctx: ContextWithBody<Env>;
}

@Route("blocks")
@Tags("blocks")
export class BlocksController extends Controller {
  @Get("")
  @Middlewares(corsMiddleware)
  public async listBlocks(@Request() request: any): Promise<Block[]> {
    const db = getDb(request.ctx);

    return new BlocksService(db).list();
  }

  @Get("{id}")
  @Middlewares(corsMiddleware)
  public async getBlock(
    @Path() id: number,
    @Request() request: any
  ): Promise<Block> {
    const db = getDb(request.ctx);

    return new BlocksService(db).get(id);
  }

  @Patch("{id}")
  @Middlewares(corsMiddleware)
  public async updateModel(
    @Body() requestBody: BlockCreationParams,
    @Path() id: number,
    @Request() request: any
  ): Promise<number> {
    const db = getDb(request.ctx);

    return new BlocksService(db).patch(id, requestBody);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  @Middlewares(corsMiddleware)
  public async createBlock(
    @Body() requestBody: BlockCreationParams,
    @Request() request: Tmp
  ): Promise<Response> {
    const db = getDb(request.ctx);

    const result = await new BlocksService(db).create(requestBody);
    this.setStatus(201); // set return status 201
    return new Response(JSON.stringify(result));
  }
}
