import useSWRInfinite from "swr/infinite";
import { Customer, getCustomers } from "../../services/customers";
import { extractErrorCode } from "../../services/error";

export const useCustomers = (
  searchInput?: string,
  customerTypes?: string[]
) => {
  const {
    data,
    error,
    isLoading: loading,
    isValidating: loadingMore,
    setSize,
  } = useSWRInfinite<
    {
      customers: Customer[];
      nextToken?: string;
    },
    Error,
    (
      index: number,
      previousPageData: {
        customers: Customer[];
        nextToken?: string;
      } | null
    ) => readonly [
      string,
      string | undefined,
      string | undefined,
      string[] | undefined
    ]
  >(
    (_index, previousRequest) => [
      "customers",
      previousRequest?.nextToken,
      searchInput,
      customerTypes,
    ],
    async ([_operation, nextToken, searchInput, customerTypes]) =>
      getCustomers(nextToken, searchInput, customerTypes)
  );

  const loadMore = () => setSize((size) => size + 1);

  const customers: Customer[] =
    data?.reduce((acc, { customers }) => {
      return [...acc, ...customers];
    }, [] as Customer[]) ?? [];

  const moreToLoad = !!data?.[data.length - 1].nextToken;

  return {
    customers,
    moreToLoad,
    error: extractErrorCode(error),
    loading,
    loadingMore,
    loadMore,
  };
};
