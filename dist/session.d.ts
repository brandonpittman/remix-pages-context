import { Session } from '@remix-run/cloudflare';

declare function commitSession(session: Session): Promise<string>;
declare function destroySession(session: Session): Promise<string>;
declare function getSession(requestOrCookie: Request | string | null): Promise<Session>;

export { commitSession, destroySession, getSession };
