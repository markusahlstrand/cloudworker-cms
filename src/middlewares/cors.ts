import { Controller, Next } from "tsoa-workers";

export default async function corsMiddleware(
  controller: Controller,
  next: Next
) {
  controller.setHeader("access-control-allow-origin", "*");

  return next();
}
