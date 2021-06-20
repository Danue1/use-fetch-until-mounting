import { DependencyList } from "react";

export type Fetch = (resolve: Resolve) => Promise<Commit>;

export type Resolve = <T>(promise: Promise<T>) => Promise<T>;

export type Commit = () => void;

export const useFetchUntilMounting: (
  dependencyList: DependencyList
) => (fetch: Fetch) => void;
