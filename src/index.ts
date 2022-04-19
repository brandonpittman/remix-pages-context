let pagesContext: {
  data: Record<string, any>;
  env: Record<string, any>;
};

export let setPagesContext = (context: typeof pagesContext) => {
  pagesContext = context;
};

export let getPagesContext = () => pagesContext;

export let updatePagesData = (data: Record<string, any>) => {
  pagesContext.data = {
    ...pagesContext.data,
    ...data,
  };
};
