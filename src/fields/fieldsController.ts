import { getDb } from "../services/db";
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  Query,
  SuccessResponse,
  Middlewares,
  Tags,
  Patch,
} from "tsoa-workers";

import { Field } from "./field";
import { FieldsService, FieldsCreationParams } from "./fieldsService";
import corsMiddleware from "../middlewares/cors";
import { RequestWithContext } from "../types/RequestWithContext";

@Route("fields")
@Tags("fields")
export class FieldsController extends Controller {
  @Get("")
  @Middlewares(corsMiddleware)
  public async listFields(
    @Request() request: any,
    @Query("modelId") modelId?: string
  ): Promise<Field[]> {
    const db = getDb(request.ctx);

    return new FieldsService(db).list(modelId);
  }

  @Get("{id}")
  @Middlewares(corsMiddleware)
  public async getField(
    @Path() id: number,
    @Request() request: any
  ): Promise<Field> {
    const db = getDb(request.ctx);

    return new FieldsService(db).get(id);
  }

  @Patch("{id}")
  @Middlewares(corsMiddleware)
  public async updateField(
    @Body() requestBody: FieldsCreationParams,
    @Path() id: number,
    @Request() request: any
  ): Promise<number> {
    const db = getDb(request.ctx);

    return new FieldsService(db).patch(id, requestBody);
  }

  @SuccessResponse("201", "Created")
  @Post()
  @Middlewares(corsMiddleware)
  public async createField(
    @Body() requestBody: FieldsCreationParams,
    @Request() request: RequestWithContext
  ): Promise<Response> {
    const db = getDb(request.ctx);

    const result = await new FieldsService(db).create(requestBody);
    this.setStatus(201); // set return status 201
    return new Response(JSON.stringify(result));
  }
}
