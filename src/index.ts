import { CookieOptions, SessionStorage } from "@remix-run/cloudflare";
import { getSessionStorage } from "./session";
import { z } from "zod";
import { TypedSessionStorage } from "remix-utils";

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
    getLoadContext(context: EventContext<any, any, any>) {
      let data = schema.parse({ ...context.data, ...context.env });
      _context = { ...data } as z.infer<Schema>;
      return _context;
    },
  };
}

export function createTypedPagesContextWithSession<
  ContextSchema extends z.AnyZodObject,
  SessionSchema extends z.AnyZodObject
>(schema: ContextSchema, options?: CookieOptions & { schema?: SessionSchema }) {
  return {
    setPagesContext(context: z.infer<ContextSchema>) {
      let next = schema.parse(context);
      _context = next;
      return _context as z.infer<ContextSchema> & {
        sessionStorage: TypedSessionStorage<SessionSchema>;
      };
    },
    getPagesContext() {
      return _context as z.infer<ContextSchema> & {
        sessionStorage: TypedSessionStorage<SessionSchema>;
      };
    },
    getLoadContext(context: EventContext<any, any, any>) {
      let sessionStorage = getSessionStorage(context.env, options);
      let data = schema.parse({ ...context.data, ...context.env });
      _context = {
        ...data,
        ...(sessionStorage ? { sessionStorage } : {}),
      };
      return _context as z.infer<ContextSchema> & {
        sessionStorage: TypedSessionStorage<SessionSchema>;
      };
    },
  };
}

export { getSessionStorage };
