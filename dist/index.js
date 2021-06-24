import { useRef } from "react";

export const useFetchUntilMounting = dependencyList => {
  const ref = useRef();
  if (!ref.current) {
    const fn = fetch => {
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
      return fetch(resolve).then(
        commit => {
          if (isMounted()) {
            commit?.();
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
