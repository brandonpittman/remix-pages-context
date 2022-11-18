import { CookieOptions, SessionStorage } from "@remix-run/cloudflare";
import { getSessionStorage } from "./session";
import { z } from "zod";

let _context: unknown;

export function createTypedPagesContext<Schema extends z.AnyZodObject>(
  schema: Schema
) {
  return {
    setPagesContext(context: z.infer<Schema>) {
      let next = schema.parse(context);
      _context = next;
      return _context as z.infer<Schema>;
    },
    getPagesContext() {
      return _context as z.infer<Schema>;
    },
    getLoadContext(context: z.infer<Schema>) {
      let data = schema.parse({ ...context.data, ...context.env });
      _context = { ...data } as z.infer<Schema>;
      return _context;
    },
  };
}

export function createTypedPagesContextWithSession<
  Schema extends z.AnyZodObject
>(schema: Schema, options?: CookieOptions) {
  return {
    setPagesContext(context: z.infer<Schema>) {
      let next = schema.parse(context);
      _context = next;
      return _context as z.infer<Schema> & { sessionStorage: SessionStorage };
    },
    getPagesContext() {
      return _context as z.infer<Schema> & { sessionStorage: SessionStorage };
    },
    getLoadContext(context: z.infer<Schema>) {
      let sessionStorage = getSessionStorage(context.env, options);
      let data = schema.parse({ ...context.data, ...context.env });
      _context = {
        ...data,
        ...(sessionStorage ? { sessionStorage } : {}),
      };
      return _context as z.infer<Schema> & { sessionStorage: SessionStorage };
    },
  };
}

export { getSessionStorage };
