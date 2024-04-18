import {
  CustomerSecondaryAddress,
  getSecondaryAddresses,
} from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import useSWRInfinite from "swr/infinite";

type KeyFunction = (
  index: number,
  previousPageData: {
    items: CustomerSecondaryAddress[];
    nextToken?: string;
  } | null
) => readonly [string, string, string | undefined];

export const keyFunctionGenerator: (customerId: string) => KeyFunction =
  (customerId: string) => (_index, previousRequest) =>
    ["customer-secondary-addresses", customerId, previousRequest?.nextToken];

export const useCustomerSecondaryAddresses = (customerId: string) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<
    { items: CustomerSecondaryAddress[]; nextToken?: string },
    Error,
    KeyFunction
  >(
    keyFunctionGenerator(customerId),
    async ([_operation, customerId, nextToken]) =>
      getSecondaryAddresses(customerId, nextToken)
  );

  const customerSecondaryAddresses: CustomerSecondaryAddress[] =
    data?.reduce((acc, { items }) => {
      return [...acc, ...items];
    }, [] as CustomerSecondaryAddress[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  const loadMore = () => setSize((size) => size + 1);

  return {
    customerSecondaryAddresses,
    error: extractErrorCode(error),
    loading,
    moreToLoad,
    loadMore,
    loadingMore,
  };
};
