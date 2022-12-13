// src/Blocks/BlocksService.ts
import { Kysely } from "kysely";
import { Database } from "../types/db";
import { Block } from "./block";

// A post request should not contain an id.
export type BlockCreationParams = Pick<Block, "name">;

export class BlocksService {
  db: Kysely<Database>;

  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  public async list(): Promise<Block[]> {
    const blocks = await this.db.selectFrom("blocks").selectAll().execute();

    return blocks;
  }

  public async get(id: number): Promise<Block> {
    const block = await this.db
      .selectFrom("blocks")
      .where("blocks.id", "=", id)
      .selectAll()
      .executeTakeFirst();

    if (!block) {
      throw new Error("Not found");
    }

    return block as Block;
  }

  public async create(
    BlockCreationParams: BlockCreationParams
  ): Promise<number> {
    const block = await this.db
      .insertInto("blocks")
      .values(BlockCreationParams)
      .returning("id")
      .executeTakeFirstOrThrow();

    return block.id;
  }
}
