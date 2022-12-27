import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("first_name", "varchar")
    .addColumn("last_name", "varchar")
    .addColumn("created_at", "varchar")
    .addColumn("modified_at", "varchar")

    // .addColumn("created_at", "timestamp", (col) =>
    //   col.defaultTo(sql`now()`).notNull()
    // )
    .execute();

  await db.schema
    .createTable("models")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("created_at", "varchar")
    .addColumn("modified_at", "varchar")
    .execute();

  await db.schema
    .createTable("blocks")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("created_at", "varchar")
    .addColumn("modified_at", "varchar")
    .execute();

  await db.schema
    .createTable("fields")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("model_id", "integer", (col) => col.notNull())
    .addColumn("order", "integer", (col) => col.notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("type", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("created_at", "varchar")
    .addColumn("modified_at", "varchar")
    .addForeignKeyConstraint(
      "model_id_fk",
      ["model_id"],
      "models",
      ["id"],
      (cb) => cb.onDelete("cascade")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
  await db.schema.dropTable("models").execute();
  await db.schema.dropTable("blocks").execute();
  await db.schema.dropTable("fields").execute();
}
