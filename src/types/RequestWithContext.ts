import { ContextWithBody } from "cloudworker-router";
import { Env } from "./Env";

export interface RequestWithContext {
  ctx: ContextWithBody<Env>;
}
