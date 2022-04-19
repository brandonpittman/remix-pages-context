# remix-pages-context

## `server.js`

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
