// src/Models/ModelsService.ts
import { Kysely } from "kysely";
import { Database } from "../types/db";
import { Model } from "./model";

// A post request should not contain an id.
export type ModelCreationParams = Pick<Model, "name" | "description">;

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

  public async patch(
    id: number,
    modelCreationParams: ModelCreationParams
  ): Promise<number> {
    const result = await this.db
      .updateTable("models")
      .set({
        ...modelCreationParams,
        modifiedAt: new Date().toISOString(),
      })
      .where("models.id", "=", id)
      .executeTakeFirst();

    return Number(result.numUpdatedRows);
  }

  public async create(
    modelCreationParams: ModelCreationParams
  ): Promise<number> {
    const results = await this.db
      .insertInto("models")
      .values({
        ...modelCreationParams,
        modifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    return results.id;
  }
}
