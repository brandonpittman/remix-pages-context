# remix-pages-context

This package lets you use Cloudflare Pages' environment variables more easily.

Some setup is requried.

## Install

```sh
npm install remix-pages-context
```

## Set up `server.js`

Import `getLoadContext` into your `server.js`. This takes the `data` and `env`
keys off the Cloudflare Pages function param and passes it to your Remix loader
context.

```ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";
import { getLoadContext } from "remix-pages-context";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext,
});

export function onRequest(context) {
  return handleRequest(context);
}
```

The provided `getLoadContext` looks like this:

```ts
getLoadContext: ({ data, env }) => {
  return setPagesContext({
    ...data,
    ...env,
  });
};
```

## Use the context

Then, in any other module, call `getPagesContext()` to access the context set in `server.js`.

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
