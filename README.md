# remix-pages-context

This package lets you use Cloudflare Pages' environment variables more easily.

Some setup is requried.

## Install

```sh
npm install remix-pages-context
```

## Set up `server.js`

Change your `server.js` to the following. This takes the `data` and `env` keys
off the Cloudflare Pages function param and passes it to your Remix loader
context.

```ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: ({ data, env }) => {
    return {
      ...data,
      ...env,
    };
  },
});

export function onRequest(context) {
  return handleRequest(context);
}
```

This is an example of what to provide your `loader` functions. You can return whatever you like here.

## `root.tsx`

Add a loader to `root.tsx` like this:

```tsx
import { setPagesContext } from "remix-pages-context";

// the `context` here will be the { ...data, ...env } from `server.js`.
export function loader({ context }) {
  setPagesContext(context);
  return null;
}
```

## Use the context

Then, in any other module, call `getPagesContext()` to access the context set in `root.tsx`.

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
