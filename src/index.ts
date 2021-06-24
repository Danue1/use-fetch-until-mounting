import { DependencyList, useEffect, useRef } from "react";

export type Fetch = (resolve: Resolve) => Promise<void | null | Commit>;

export type Resolve = <T>(promise: Promise<T>) => Promise<T>;

export type Commit = () => void;

export const useFetchUntilMounting = (
  dependencyList: DependencyList
): ((fetch: Fetch) => Promise<void>) => {
  const ref = useRef<{ fn: (fetch: Fetch) => Promise<void> }>();
  if (!ref.current) {
    const fn = (fetch: Fetch): Promise<void> => {
      const current = ref.current;
      const isMounted = (): boolean =>
        ref.current !== undefined && current === ref.current;
      const resolve = <T>(promise: Promise<T>): Promise<T> =>
        promise.then(item => {
          if (isMounted()) {
            return item;
          }
          // eslint-disable-next-line
          throw null;
        });
      return fetch(resolve).then(
        commit => {
          if (isMounted()) {
            (commit as undefined | null | Commit)?.();
          }
        },
        error => {
          if (isMounted()) {
            throw error;
          }
        }
      );
    };

    ref.current = { fn };
  }

  useEffect(() => {
    return () => {
      ref.current = undefined;
    };
  }, dependencyList);

  return ref.current.fn;
};
