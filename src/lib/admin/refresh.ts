import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import { revalidateTag, updateTag } from "next/cache";

const outsideAction = new AsyncLocalStorage<true>();

/**
 * Runs an admin mutation on behalf of a Route Handler (the mobile API).
 * `updateTag` throws outside Server Actions, so the same mutations expire
 * their tags with `revalidateTag` when called from there instead.
 */
export function runOutsideAction<T>(fn: () => Promise<T>): Promise<T> {
  return outsideAction.run(true, fn);
}

/** Expires a cache tag immediately, from whichever context the mutation runs in. */
export function refreshTag(tag: string) {
  if (outsideAction.getStore()) revalidateTag(tag, { expire: 0 });
  else updateTag(tag);
}
