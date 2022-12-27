import { ModelTable } from "../models/model";
import { UserTable } from "../users/user";
import { BlocksTable } from "../blocks/block";
import { FieldsTable } from "../fields/field";

// Keys of this interface are table names.
export interface Database {
  users: UserTable;
  models: ModelTable;
  blocks: BlocksTable;
  fields: FieldsTable;
}
