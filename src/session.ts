import {
  createCookie,
  createCloudflareKVSessionStorage,
  CookieOptions,
} from "@remix-run/cloudflare";
import invariant from "tiny-invariant";

import { getPagesContext } from "./index";

let SECONDS_IN_DAY = 86400;
let YEAR = SECONDS_IN_DAY * 365;
let expires = new Date(Date.now() + YEAR * 1000);
let maxAge = YEAR;

export let getSessionStorage = (
  env = getPagesContext(),
  options?: CookieOptions
) => {
  invariant(env.SESSION_SECRET, "SESSION_SECRET is not defined");
  invariant(env.KV, "KV namespace, KV, is not defined");

  let cookie = createCookie("__session", {
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
