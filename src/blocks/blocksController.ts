// src/Blocks/BlocksController.ts
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

import { Block } from "./block";
import { BlocksService, BlockCreationParams } from "./blocksService";

interface Tmp {
  ctx: ContextWithBody<Env>;
}

@Route("blocks")
@Tags("blocks")
export class BlocksController extends Controller {
  @Get("")
  public async listBlocks(@Request() request: any): Promise<Block[]> {
    const db = getDb(request.ctx);

    return new BlocksService(db).list();
  }

  @Get("{id}")
  public async getBlock(
    @Path() id: number,
    @Request() request: any
  ): Promise<Block> {
    const db = getDb(request.ctx);

    return new BlocksService(db).get(id);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post()
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
