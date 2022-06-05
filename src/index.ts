import { getSessionStorage } from "./session";

let pagesContext: Record<string, any>;

type Context = typeof pagesContext;

export let setPagesContext = (context: Context) => {
  pagesContext = context;

  return context;
};

export let getPagesContext = () => pagesContext;

export let getLoadContext = ({ data, env }: Context) => {
  const session = getSessionStorage();

  setPagesContext({
    ...data,
    ...env,
  });

  return setPagesContext({
    ...data,
    ...env,
    ...session,
  });
};
