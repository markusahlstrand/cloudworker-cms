import { Generated } from "kysely";

interface FieldBase {
  name?: string;
  description?: string;
  modelId: number;
  order: number;
  type: "text" | "boolean" | "block";
  readonly createdAt?: string;
  readonly modifiedAt?: string;
}

export interface Field extends FieldBase {
  id: number;
}

export interface FieldsTable extends FieldBase {
  id: Generated<number>;
}
