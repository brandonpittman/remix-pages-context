import { CookieOptions } from "@remix-run/cloudflare";
import { getSessionStorage } from "./session";

let pagesContext: Record<string, any>;

export type PagesContext = typeof pagesContext;

export let setPagesContext = (context: PagesContext) => {
  pagesContext = context;

  return context;
};

export let getPagesContext = () => pagesContext;

export let getLoadContext = ({ data, env }: PagesContext) => {
  return setPagesContext({
    ...data,
    ...env,
  });
};

export let getLoadContextWithSession = (
  { data, env }: PagesContext,
  options: CookieOptions
) => {
  let session = getSessionStorage(env, options);

  return setPagesContext({
    ...data,
    ...env,
    ...(session ? { session } : {}),
  });
};

export { getSessionStorage };
