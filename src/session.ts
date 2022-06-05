import {
  createCookie,
  createCloudflareKVSessionStorage,
  CookieOptions,
} from "@remix-run/cloudflare";

import { getPagesContext } from "./index";

const SECONDS_IN_DAY = 86400;
const YEAR = SECONDS_IN_DAY * 365;
let expires = new Date(Date.now() + YEAR * 1000);
let maxAge = YEAR;

export const getSessionStorage = (
  env = getPagesContext(),
  options?: CookieOptions
) => {
  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not defined");

  if (!env.KV) throw new Error("KV namespace, KV, is not defined");

  const cookie = createCookie("__session", {
    expires,
    maxAge,
    secrets: [env.SESSION_SECRET],
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    ...options,
  });

  return createCloudflareKVSessionStorage({
    kv: env.KV,
    cookie,
  });
};
