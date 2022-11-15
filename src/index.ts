import { CookieOptions, SessionStorage } from "@remix-run/cloudflare";
import { getSessionStorage } from "./session";
import { z } from "zod";

let _context: unknown;

export function createTypedPagesContext<Schema extends z.AnyZodObject>(
  schema: Schema
) {
  return {
    setPagesContext(context: z.infer<Schema>) {
      let { data, env } = schema.parse(context);
      return { ...data, ...env } as z.infer<Schema>;
    },
    getPagesContext() {
      return _context as z.infer<Schema>;
    },
    getLoadContext(context: z.infer<Schema>) {
      let { data, env } = schema.parse(context);
      return { ...data, ...env } as z.infer<Schema>;
    },
  };
}

export function createTypedPagesContextWithSession<
  Schema extends z.AnyZodObject
>(schema: Schema, options?: CookieOptions) {
  return {
    setPagesContext(context: z.infer<Schema>) {
      let session = getSessionStorage(context.env);
      let { data, env } = schema.parse(context);
      return {
        ...(env as z.infer<Schema>["env"]),
        ...(data as z.infer<Schema>["data"]),
        ...(session ? { session } : {}),
      } as z.infer<Schema> & { session: SessionStorage };
    },
    getPagesContext() {
      return _context as z.infer<Schema> & { session: SessionStorage };
    },
    getLoadContext(context: z.infer<Schema>) {
      let session = getSessionStorage(context.env, options);
      let { data, env } = schema.parse(context);
      return {
        ...(env as z.infer<Schema>["env"]),
        ...(data as z.infer<Schema>["data"]),
        ...(session ? { session } : {}),
      } as z.infer<Schema> & { session: SessionStorage };
    },
  };
}

export { getSessionStorage };
