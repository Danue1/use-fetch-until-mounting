import { DependencyList, useEffect, useRef } from "react";

export type Fetch = (resolve: Resolve) => Promise<Commit>;

export type Resolve = <T>(promise: Promise<T>) => Promise<T>;

export type Commit = () => void;

export const useFetchUntilMounting = (
  dependencyList: DependencyList
): ((fetch: Fetch) => void) => {
  const ref = useRef<{ readonly dependencyList: DependencyList }>();
  if (!ref.current) {
    ref.current = { dependencyList };
  }

  useEffect(() => {
    return () => {
      ref.current = undefined;
    };
  }, dependencyList);

  const fetch = (fetch: Fetch): void => {
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
    fetch(resolve).then(
      commit => {
        if (isMounted()) {
          commit();
        }
      },
      error => {
        if (isMounted()) {
          throw error;
        }
      }
    );
  };

  return fetch;
};
