import { Generated } from "kysely";

interface BlockBase {
  name?: string;
  description?: string;
  readonly createdAt?: string;
  readonly modifiedAt?: string;
}

export interface Block extends BlockBase {
  id: number;
}

export interface BlocksTable extends BlockBase {
  id: Generated<number>;
}
