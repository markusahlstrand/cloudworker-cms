import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("users")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("first_name", "varchar")
    .addColumn("last_name", "varchar")
    // .addColumn("created_at", "timestamp", (col) =>
    //   col.defaultTo(sql`now()`).notNull()
    // )
    .execute();

  await db.schema
    .createTable("models")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("blocks")
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("users").execute();
  await db.schema.dropTable("models").execute();
  await db.schema.dropTable("blocks").execute();
}
