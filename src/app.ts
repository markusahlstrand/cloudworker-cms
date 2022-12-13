import { Router, bodyparser, Context } from "cloudworker-router";

import { Env } from "./types/Env";
import { RegisterRoutes } from "../build/routes";
import swagger from "../build/swagger.json";
import packageJson from "../package.json";
import swaggerUi from "./routes/swagger-ui";
import { migrateDown, migrateToLatest } from "./migrate";
import { getDb } from "./services/db";

export const app = new Router<Env>();

app.get("/", async () => {
  return new Response(
    JSON.stringify({
      name: packageJson.name,
      version: packageJson.version,
    })
  );
});

app.get("/spec", async () => {
  return new Response(JSON.stringify(swagger));
});

app.get("/docs", swaggerUi);

app.post("/migrate-to-latest", async (ctx: Context<Env>) => {
  try {
    await migrateToLatest(ctx);
    return new Response("OK");
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: err.message,
        cause: err.cause,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
});

app.post("/migrate-down", async (ctx: Context<Env>) => {
  try {
    await migrateDown(ctx);
    return new Response("OK");
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: err.message,
        cause: err.cause,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
});

app.get("/tmp", async (ctx: Context<Env>) => {
  try {
    const db = getDb(ctx);
    const results = await db.selectFrom("models").selectAll().execute();

    return new Response(JSON.stringify(results));
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: err.message,
        stack: err.stack,
        cause: err.cause,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
});

app.post("/insert", async (ctx: Context<Env>) => {
  try {
    const db = getDb(ctx);
    const results = await db
      .insertInto("models")
      .values({ name: "test3" })
      .returning("id")
      .executeTakeFirstOrThrow();

    return new Response(JSON.stringify(results));
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: err.message,
        cause: err.cause,
      }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }
});

app.use(bodyparser);

RegisterRoutes(app);
