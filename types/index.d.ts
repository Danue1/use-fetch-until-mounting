import { DependencyList } from "react";

export type Fetch = (resolve: Resolve) => Promise<void | null | Commit>;

export type Resolve = <T>(promise: Promise<T>) => Promise<T>;

export type Commit = () => void;

export const useFetchUntilMounting: (
  dependencyList: DependencyList
) => (fetch: Fetch) => Promise<void>;
