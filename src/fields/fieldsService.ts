import { Kysely } from "kysely";
import { Database } from "../types/db";
import { Field } from "./field";

// A post request should not contain an id.
export type FieldsCreationParams = Pick<
  Field,
  "name" | "description" | "modelId" | "order" | "type"
>;

export class FieldsService {
  db: Kysely<Database>;

  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  public async list(modelId?: string): Promise<Field[]> {
    let query = this.db.selectFrom("fields").selectAll();
    if (modelId) {
      query = query.where("fields.modelId", "=", parseInt(modelId, 10));
    }
    const fields = await query.execute();

    return fields;
  }

  public async get(id: number): Promise<Field> {
    const field = await this.db
      .selectFrom("fields")
      .where("fields.id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!field) {
      throw new Error("Not found");
    }

    return field as Field;
  }

  public async patch(
    id: number,
    fieldCreationParams: FieldsCreationParams
  ): Promise<number> {
    const result = await this.db
      .updateTable("fields")
      .set({
        ...fieldCreationParams,
        modifiedAt: new Date().toISOString(),
      })
      .where("fields.id", "=", id)
      .executeTakeFirst();

    return Number(result.numUpdatedRows);
  }

  public async create(
    fieldCreationParams: FieldsCreationParams
  ): Promise<number> {
    const results = await this.db
      .insertInto("fields")
      .values({
        ...fieldCreationParams,
        modifiedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    return results.id;
  }
}
