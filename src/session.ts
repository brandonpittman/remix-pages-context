import type { Session } from "@remix-run/cloudflare";
import {
  createCookie,
  createCloudflareKVSessionStorage,
} from "@remix-run/cloudflare";

import { getPagesContext } from "./index";

const SECONDS_IN_DAY = 86400;
const YEAR = SECONDS_IN_DAY * 365;
let expires = new Date(Date.now() + YEAR * 1000);
let maxAge = YEAR;

function getSessionStorage() {
  let env = getPagesContext();

  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not defined");

  if (!env.KV) throw new Error("KV namespace, KV, is not defined");

  const cookie = createCookie("__session", {
    expires,
    maxAge,
    secrets: [env.SESSION_SECRET],
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });

  return createCloudflareKVSessionStorage({
    kv: env.KV,
    cookie,
  });
}

export function commitSession(session: Session) {
  let sessionStorage = getSessionStorage();

  return sessionStorage.commitSession(session);
}

export function destroySession(session: Session) {
  let sessionStorage = getSessionStorage();

  return sessionStorage.destroySession(session);
}

export function getSession(requestOrCookie: Request | string | null) {
  let cookie =
    typeof requestOrCookie === "string"
      ? requestOrCookie
      : requestOrCookie?.headers.get("Cookie");

  let sessionStorage = getSessionStorage();

  return sessionStorage.getSession(cookie);
}
