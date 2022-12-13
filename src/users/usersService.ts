// src/users/usersService.ts
import { Kysely } from "kysely";
import { Database } from "../types/db";
import { User } from "./user";

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "firstName" | "lastName">;

export class UsersService {
  db: Kysely<Database>;

  constructor(db: Kysely<Database>) {
    this.db = db;
  }

  public async list(): Promise<User[]> {
    const users = await this.db.selectFrom("users").selectAll().execute();

    return users;
  }

  public async get(id: number): Promise<User> {
    const user = await this.db
      .selectFrom("users")
      .where("users.id", "=", id)
      .executeTakeFirst();

    if (!user) {
      throw new Error("Not found");
    }

    return user as User;
  }

  public async create(userCreationParams: UserCreationParams): Promise<User> {
    const user = await this.db
      .insertInto("users")
      .values(userCreationParams)
      // .values({ firstName: "markus", lastName: "ahlstrand", email: "email" })
      .returning("id")
      .executeTakeFirstOrThrow();

    return user as User;
  }
}
