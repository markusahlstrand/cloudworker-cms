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

app.post("/tmp", async (ctx: Context<Env>) => {
  try {
    // const db = getDb(ctx);

    const statement = ctx.env.CMS.prepare(
      "update blocks set created_at = ?1 where id = ?2"
    ).bind(1671377507089, 1);
    // const statement = ctx.env.CMS.prepare(
    //   "update blocks set description = ?1 where id = ?2"
    // ).bind("2022-12-18T15:29:46.190Z", 1);
    // const statement = ctx.env.CMS.prepare("select * FROM blocks");

    const response = await statement.all();

    // await db
    //   .updateTable("blocks")
    //   .set({ modifiedAt: new Date().toISOString() })
    //   .executeTakeFirst();
    return new Response(JSON.stringify(response));
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

app.use(app.allowedMethods());
