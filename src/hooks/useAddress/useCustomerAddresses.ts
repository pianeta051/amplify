import useSWRInfinite from "swr/infinite";
import {
  CustomerSecondaryAddress,
  getAddresses,
} from "../../services/customers";
import { extractErrorCode } from "../../services/error";

type KeyFunction = (
  index: number,
  previousPageData: {
    items: CustomerSecondaryAddress[];
    nextToken?: string;
  } | null
) => readonly [string, string, string | undefined];

export const keyFunctionGenerator: (customerId: string) => KeyFunction =
  (customerId: string) => (_index, previousRequest) =>
    ["customer-addresses", customerId, previousRequest?.nextToken];

export const useCustomerAddresses = (customerId: string) => {
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
      getAddresses(customerId, nextToken)
  );

  const addresses: CustomerSecondaryAddress[] =
    data?.reduce((acc, { items }) => {
      return [...acc, ...items];
    }, [] as CustomerSecondaryAddress[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  const loadMore = () => setSize((size) => size + 1);

  return {
    addresses,
    error: extractErrorCode(error),
    loading,
    moreToLoad,
    loadMore,
    loadingMore,
  };
};
