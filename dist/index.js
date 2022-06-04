var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

// src/session.ts
import { createCookieSessionStorage } from "@remix-run/cloudflare";
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

// src/index.ts
var pagesContext;
var setPagesContext = (context) => {
  pagesContext = context;
  return context;
};
var getPagesContext = () => pagesContext;
var getLoadContext = ({ data, env }) => {
  return setPagesContext(__spreadValues(__spreadValues({}, data), env));
};
export {
  commitSession,
  destroySession,
  getLoadContext,
  getPagesContext,
  getSession,
  setPagesContext
};
