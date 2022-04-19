# remix-pages-context

This package lets you use Cloudflare Pages' environment variables more easily.

Some setup is requried.

## Install

```sh
npm install remix-pages-context
```

## `server.js`

Change your `server.js` to the following. This takes the `data` and `env` keys
off the Cloudflare Pages function param and passes it to your Remix loader
context.

```js
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: ({ data, env }) => {
    return {
      data,
      env,
    };
  },
});

export function onRequest(context) {
  return handleRequest(context);
}
```

## `root.tsx`

Add a loader to `root.tsx` like this:

```ts
import { setPagesContext } from "remix-pages-context";

export function loader({ context }) {
  setPagesContext(context);
  return null;
}
```

## Use the context

Then, in any other module, call `getPagesContext()` to access the context set in `root.tsx`.

## Updating `data`

Cloudflare Pages also lets you pass arbitrary data around. While not immediately useful to Remix, the capability is maintained here. The update function does a shallow merge of the param and existing object.

```ts
// given { foo: "foo", msg: "Hello."}

updatePagesData({
  msg: "Hey there.",
});

// => { foo: "foo", msg: "Hey there."}
```
