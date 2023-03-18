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
  }: { contextSchema: ContextSchema; sessionSchema?: SessionSchema },
  options?: CookieOptions
) {
  return {
    getPagesContext() {
      if (sessionSchema) {
        return _context as {
          env: z.infer<ContextSchema>;
        } & {
          sessionStorage?: TypedSessionStorage<SessionSchema>;
        };
      } else {
        return _context as {
          env: z.infer<ContextSchema>;
        };
      }
    },
    getLoadContext(context: EventContext<any, any, any>) {
      if (sessionSchema) {
        let sessionStorage = getSessionStorage(
          context.env,
          sessionSchema,
          options
        );
        let env = contextSchema.parse(context.env);
        _context = {
          env,
          ...(sessionStorage ? { sessionStorage } : {}),
        };
        return context as Omit<EventContext<any, any, any>, "env"> & {
          env: z.infer<ContextSchema>;
          sessionStorage: TypedSessionStorage<SessionSchema>;
        };
      } else {
        let env = contextSchema.parse(context.env);
        _context = {
          env,
        };
        return context as Omit<EventContext<any, any, any>, "env"> & {
          env: z.infer<ContextSchema>;
        };
      }
    },
  };
}
