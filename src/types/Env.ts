import { Kysely } from "kysely";

export interface Env {
  CMS: D1Database;
  DB: Kysely<D1Database>;
}
