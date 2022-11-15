import { CookieOptions, SessionStorage } from "@remix-run/cloudflare";
import { getSessionStorage } from "./session";
import { z } from "zod";

let _context: unknown;

export function createTypedPagesContext<Schema extends z.AnyZodObject>(
  schema: Schema
) {
  return {
    setPagesContext(context: z.infer<Schema>) {
      _context = schema.parse(context);
      return _context as z.infer<Schema>;
    },
    getPagesContext() {
      return _context as z.infer<Schema>;
    },
    getLoadContext(context: z.infer<Schema>) {
      _context = schema.parse(context);
      return _context as z.infer<Schema>;
    },
    getLoadContextWithSession(
      context: z.infer<Schema>,
      options?: CookieOptions
    ) {
      let session = getSessionStorage(context.env, options);
      _context = schema.parse(context);
      return {
        ...(_context as z.infer<Schema>),
        ...(session ? { session } : {}),
      } as z.infer<Schema> & { session: SessionStorage };
    },
  };
}

export { getSessionStorage };
