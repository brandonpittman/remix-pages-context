import type { Session } from "@remix-run/cloudflare";
import { createCookieSessionStorage } from "@remix-run/cloudflare";

import { getPagesContext } from "./index";

const SECONDS_IN_DAY = 86400;
const MONTH = SECONDS_IN_DAY * 31;
let expires = new Date(Date.now() + MONTH * 1000);
let maxAge = MONTH;

// @see: https://github.com/jacob-ebey/remix-cloudflare-worker-template/blob/main/packages/remix-app/app/session.server.ts
function getSessionStorage() {
  let env = getPagesContext();

  if (!env.SESSION_SECRET) throw new Error("SESSION_SECRET is not defined");

  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      expires,
      maxAge,
      secrets: [env.SESSION_SECRET],
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    },
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
