export { commitSession, destroySession, getSession } from './session.js';
import '@remix-run/cloudflare';

declare let pagesContext: Record<string, any>;
declare type Context = typeof pagesContext;
declare let setPagesContext: (context: Context) => Record<string, any>;
declare let getPagesContext: () => Record<string, any>;
declare let getLoadContext: ({ data, env }: Context) => Record<string, any>;

export { getLoadContext, getPagesContext, setPagesContext };
