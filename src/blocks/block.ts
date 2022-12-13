import { Generated } from "kysely";

interface BlockBase {
  name: string;
}

export interface Block extends BlockBase {
  id: number;
}

export interface BlocksTable extends BlockBase {
  id: Generated<number>;
}
