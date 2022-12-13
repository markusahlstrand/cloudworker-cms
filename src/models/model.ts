import { Generated } from "kysely";

interface ModelBase {
  name: string;
}

export interface Model extends ModelBase {
  id: number;
}

export interface ModelTable extends ModelBase {
  id: Generated<number>;
}
