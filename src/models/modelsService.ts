// src/Models/ModelsService.ts
import { Mode } from "fs";
import { Kysely } from "kysely";
import { Database } from "../types/db";
import { Model } from "./model";

// A post request should not contain an id.
export type ModelCreationParams = Pick<Model, "name">;

export class ModelsService {
  db: Kysely<Database>;

  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  public async list(): Promise<Model[]> {
    const models = await this.db.selectFrom("models").selectAll().execute();

    return models;
  }

  public async get(id: number): Promise<Model> {
    const model = await this.db
      .selectFrom("models")
      .where("models.id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!model) {
      throw new Error("Not found");
    }

    return model as Model;
  }

  public async create(
    ModelCreationParams: ModelCreationParams
  ): Promise<number> {
    const results = await this.db
      .insertInto("models")
      .values(ModelCreationParams)
      .returning("id")
      .executeTakeFirstOrThrow();

    return results.id;
  }
}
