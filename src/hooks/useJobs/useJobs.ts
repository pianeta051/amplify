import useSWRInfinite from "swr/infinite";
import { Job, JobFilters, getJobs } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";

type KeyFunction = (
  index: number,
  previousPageData: { jobs: Job[]; nextToken?: string } | null
) => readonly [string, JobFilters, "desc" | "asc", string | undefined];

export const keyFunctionGenerator: (
  filters: JobFilters,
  order?: "desc" | "asc"
) => KeyFunction =
  (filters: JobFilters, order: "desc" | "asc" = "asc") =>
  (_index, previousRequest) =>
    ["jobs", filters, order, previousRequest?.nextToken];

export const useJobs = (filters: JobFilters, order: "desc" | "asc" = "asc") => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<{ jobs: Job[]; nextToken?: string }, Error, KeyFunction>(
    keyFunctionGenerator(filters, order),
    async ([_operation, filters, order, nextToken]) =>
      getJobs(filters, order, nextToken)
  );

  const loadMore = () => setSize((size) => size + 1);

  const jobs: Job[] =
    data?.reduce((acc, { jobs }) => {
      return [...acc, ...jobs];
    }, [] as Job[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    jobs,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadMore,
    loadingMore,
  };
};
