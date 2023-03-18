# remix-pages-context

This package lets you use Cloudflare Pages' environment variables and KV-backed sessions more easily.
Some setup is requried.

## Install

```sh
npm install remix-pages-context
```

## Set up `server.ts`

1. Create a typed context object, passing in Zod schemas for your ENV variables and session values
2. Destructure `getLoadContext` and `getPagesContext` off the object
3. Pass `getLoadContext` into `createPagesFunctionHandler`
4. Use `getPagesContext` anywhere you want to access your typed ENV variables and session values

```ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { createTypedPagesContext } from "remix-pages-context";
import { z } from "zod";

export let contextSchema = z.object({
  SESSION_SECRET: z.string(),
  // other ENV vars...
});

export let sessionSchema = z.object({
  someValue: z.string().optional(),
});

export let { getLoadContext, getPagesContext } = createTypedPagesContext({
  contextSchema,
  sessionSchema,
});

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext,
});

export function onRequest(context: EventContext<any, any, any>) {
  return handleRequest(context);
}
```

## Optional Typed Sessions

If you provide a Zod schema for `sessionSchema` like this:

```
createTypedPagesContext({ contextSchema, sessionSchema })
```

…you will get a [typed session from Remix Utils](https://github.com/sergiodxa/remix-utils#typed-sessions).

### KV Session

Enable Cloudflare KV session storage when you create a KV namespace named `KV` and
an environment variable named `SESSION_SECRET`. The factory function takes a
second param of `CookieOptions` if you want to customize the underlying cookie
that's used for the session storage.

## Use the context

In loaders, you can access `context` along with `request` and `params`, but it won't be typed. Better to use it like this:

```ts
export let loader = async() {
  let { env, sessionStorage } = getPagesContext();
}
```

Then, in any other module, call `getPagesContext()` to access the context set in `server.ts`.

## Limitations

If you call `getPagesContext()` in a `*.server.ts` module, you need to call it in a function because it will be `undefined`
until the `loader` in `root.tsx` is run.

```ts
// foo.server.ts
import { getPagesContext } from "server";

export let foo = async () => {
  let { env, sessionStorage } = getPagesContext();
  // do something with context
};
```
