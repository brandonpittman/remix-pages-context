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
