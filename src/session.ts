import {
  createCookie,
  createCloudflareKVSessionStorage,
  CookieOptions,
} from "@remix-run/cloudflare";
import { createTypedSessionStorage } from "remix-utils";
import invariant from "tiny-invariant";
import { z } from "zod";

let SECONDS_IN_DAY = 86400;
let YEAR = SECONDS_IN_DAY * 365;
let maxAge = YEAR;

export let getSessionStorage = (
  env: any,
  options?: CookieOptions & { schema?: z.AnyZodObject }
) => {
  invariant(env.SESSION_SECRET, "SESSION_SECRET is not defined");
  invariant(env.KV, "KV namespace, KV, is not defined");

  let cookie = createCookie("__session", {
    maxAge,
    secrets: [env.SESSION_SECRET],
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    ...options,
  });

  let sessionStorage = createCloudflareKVSessionStorage({
    kv: env.KV,
    cookie,
  });

  if (options?.schema) {
    return createTypedSessionStorage({
      sessionStorage,
      schema: options.schema,
    });
  } else {
    return sessionStorage;
  }
};
