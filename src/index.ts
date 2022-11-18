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
      return _context as z.infer<ContextSchema> & {
        sessionStorage: TypedSessionStorage<SessionSchema>;
        //getSession: TypedSessionStorage<SessionSchema>["getSession"];
        //commitSession: TypedSessionStorage<SessionSchema>["commitSession"];
        //destroySession: TypedSessionStorage<SessionSchema>["destroySession"];
      };
    },
    getLoadContext(context: EventContext<any, any, any>) {
      let sessionStorage = getSessionStorage(
        context.env,
        sessionSchema,
        options
      );
      let data = contextSchema.parse(context);
      _context = {
        ...data,
        ...(sessionStorage ? { sessionStorage } : {}),
      };
      return _context as z.infer<ContextSchema> & {
        sessionStorage: TypedSessionStorage<SessionSchema>;
        //getSession: TypedSessionStorage<SessionSchema>["getSession"];
        //commitSession: TypedSessionStorage<SessionSchema>["commitSession"];
        //destroySession: TypedSessionStorage<SessionSchema>["destroySession"];
      };
    },
  };
}
