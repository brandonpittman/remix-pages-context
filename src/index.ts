import { getSessionStorage } from "./session";

let pagesContext: Record<string, any>;

type Context = typeof pagesContext;

export let setPagesContext = (context: Context) => {
  pagesContext = context;

  return context;
};

export let getPagesContext = () => pagesContext;

export let getLoadContext = ({ data, env }: Context) => {
  return setPagesContext({
    ...data,
    ...env,
  });
};

export let getLoadContextWithSession = ({ data, env }: Context) => {
  let session = getSessionStorage(env);

  return setPagesContext({
    ...data,
    ...env,
    ...session,
  });
};
