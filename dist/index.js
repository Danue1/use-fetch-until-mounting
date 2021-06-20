import { useEffect, useRef } from "react";

export const useFetchUntilMounting = dependencyList => {
  const ref = useRef();
  if (!ref.current) {
    ref.current = { dependencyList };
  }

  useEffect(() => {
    return () => {
      ref.current = undefined;
    };
  }, dependencyList);

  const fetch = fetch => {
    const current = ref.current;
    const isMounted = () =>
      ref.current !== undefined && current === ref.current;
    const resolve = promise =>
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
