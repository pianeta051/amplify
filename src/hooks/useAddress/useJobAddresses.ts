import useSWRInfinite from "swr/infinite";
import { extractErrorCode } from "../../services/error";
import { CustomerSecondaryAddress } from "../../services/customers";
import { getJobAddresses } from "../../services/addresses";

type KeyFunction = (
  index: number,
  previousPageData: {
    addresses: CustomerSecondaryAddress[];
    nextToken?: string;
  } | null
) => readonly [string, string, string | undefined] | null;

export const keyFunctionGenerator: (jobId?: string) => KeyFunction =
  (jobId?: string) => (_index, previousRequest) =>
    jobId ? ["jobAddresses", jobId, previousRequest?.nextToken] : null;

export const useJobAddresses = (jobId?: string) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<
    { addresses: CustomerSecondaryAddress[]; nextToken?: string },
    Error,
    KeyFunction
  >(keyFunctionGenerator(jobId), async ([_operation, jobId, nextToken]) =>
    getJobAddresses(jobId, nextToken)
  );

  const loadMore = () => setSize((size) => size + 1);

  const addresses: CustomerSecondaryAddress[] =
    data?.reduce((acc, { addresses }) => {
      return [...acc, ...addresses];
    }, [] as CustomerSecondaryAddress[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    addresses,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadMore,
    loadingMore,
  };
};
