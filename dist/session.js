// src/session.ts
import { createCookieSessionStorage } from "@remix-run/cloudflare";

// src/index.ts
var pagesContext;
var getPagesContext = () => pagesContext;

// src/session.ts
var SECONDS_IN_DAY = 86400;
var MONTH = SECONDS_IN_DAY * 31;
var expires = new Date(Date.now() + MONTH * 1e3);
var maxAge = MONTH;
function getSessionStorage() {
  let env = getPagesContext();
  if (!env.SESSION_SECRET)
    throw new Error("SESSION_SECRET is not defined");
  return createCookieSessionStorage({
    cookie: {
      name: "__session",
      expires,
      maxAge,
      secrets: [env.SESSION_SECRET],
      httpOnly: true,
      sameSite: "lax",
      secure: true
    }
  });
}
function commitSession(session) {
  let sessionStorage = getSessionStorage();
  return sessionStorage.commitSession(session);
}
function destroySession(session) {
  let sessionStorage = getSessionStorage();
  return sessionStorage.destroySession(session);
}
function getSession(requestOrCookie) {
  let cookie = typeof requestOrCookie === "string" ? requestOrCookie : requestOrCookie == null ? void 0 : requestOrCookie.headers.get("Cookie");
  let sessionStorage = getSessionStorage();
  return sessionStorage.getSession(cookie);
}
export {
  commitSession,
  destroySession,
  getSession
};
