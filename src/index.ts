import { CookieOptions } from "@remix-run/cloudflare";
import { getSessionStorage } from "./session";
import { z } from "zod";
import { TypedSessionStorage } from "remix-utils";

let _context: unknown;

export function createTypedPagesContext<
  ContextSchema extends z.AnyZodObject,
  SessionSchema extends z.AnyZodObject
>(
  {
    contextSchema,
    sessionSchema,
  }: { contextSchema: ContextSchema; sessionSchema: SessionSchema },
  options?: CookieOptions
) {
  return {
    getPagesContext() {
      return _context as Omit<EventContext<any, any, any>, "env"> & {
        env: z.infer<ContextSchema>;
      } & {
        sessionStorage: TypedSessionStorage<SessionSchema>;
      };
    },
    getLoadContext(context: EventContext<any, any, any>) {
      let sessionStorage = getSessionStorage(
        context.env,
        sessionSchema,
        options
      );
      let env = contextSchema.parse(context.env);
      _context = {
        ...context,
        env,
        ...(sessionStorage ? { sessionStorage } : {}),
      };
      return _context as Omit<EventContext<any, any, any>, "env"> & {
        env: z.infer<ContextSchema>;
        sessionStorage: TypedSessionStorage<SessionSchema>;
      };
    },
  };
}

let context = createTypedPagesContext({
  contextSchema: z.object({
    foo: z.string(),
  }),
  sessionSchema: z.object({
    foo: z.string(),
  }),
});
