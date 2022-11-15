import { CookieOptions } from "@remix-run/cloudflare";
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
      return this.setPagesContext(context);
    },
    getLoadContextWithSession(
      context: z.infer<Schema>,
      options?: CookieOptions
    ) {
      let session = getSessionStorage(context.env, options);
      return this.setPagesContext({
        ...context,
        ...(session ? { session } : {}),
      }) as z.infer<Schema> & { session: typeof session };
    },
  };
}

export { getSessionStorage };
