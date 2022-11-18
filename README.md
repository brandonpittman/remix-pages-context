# remix-pages-context

This package lets you use Cloudflare Pages' environment variables more easily.

Some setup is requried.

## Install

```sh
npm install remix-pages-context
```

## Set up `server.ts`

Import `getLoadContext` into your `server.ts`. This takes the `data` and `env`
keys off the Cloudflare Pages function param and passes it to your Remix loader
context.

```ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import {
  // Choose one of the two...
  createTypedPagesContext,
  createTypedPagesContextWithSession,
} from "remix-pages-context";
import { z } from "zod";

export let schema = z.object({
  SESSION_SECRET: z.string(), // only necessary if you're using the WithSession variant
  // other ENV vars...
});

export let { getLoadContext, getPagesContext, setPagesContext } =
  createTypedPagesContextWithSession(schema);

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext,
});

export function onRequest(context: EventContext<any, any, any>) {
  return handleRequest(context);
}
```

## Use the context

In loaders, you can access `context` along with `request` and `params`, but it won't be typed. Better to use it like this:

```ts
export let loader = async() {
  let {
    sessionStorage: {
      getSession,
      commitSession,
      destroySession
    },
    // all your other ENV vars...
  } = getPagesContext();
}
```

Then, in any other module, call `getPagesContext()` to access the context set in `server.ts`.

## Limitations

If you call `getPagesContext()` in a `*.server.ts` module, you need to call it in a function because it will be `undefined`
until the `loader` in `root.tsx` is run.

```ts
// foo.server.ts
import { getPagesContext } from "remix-pages-context";

let context;

const foo = () => {
  context = getPagesContext();
  // do something with context
};
```

## KV Session

To enable Cloudflare KV session storage, create a KV namespace named `KV` and
an environment variable named `SESSION_SECRET`. The `WithSession` version of
the factory function takes a second param of `CookieOptions` if you want to
customize the underlying cookie that's used for the session storage.
