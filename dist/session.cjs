var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/session.ts
var session_exports = {};
__export(session_exports, {
  commitSession: () => commitSession,
  destroySession: () => destroySession,
  getSession: () => getSession
});
module.exports = __toCommonJS(session_exports);
var import_cloudflare = require("@remix-run/cloudflare");

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
  return (0, import_cloudflare.createCookieSessionStorage)({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  commitSession,
  destroySession,
  getSession
});
