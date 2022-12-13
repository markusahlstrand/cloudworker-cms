import { Generated } from "kysely";

interface UserBase {
  email: string;
  firstName: string;
  lastName: string;
}

export interface User extends UserBase {
  id: number;
}

export interface UserTable extends UserBase {
  id: Generated<number>;
}
