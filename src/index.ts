let pagesContext: Record<string, any>;

export let setPagesContext = (context: typeof pagesContext) => {
  pagesContext = context;

  return context;
};

export let getPagesContext = () => pagesContext;
