import useSWR from "swr";
import { CustomerSecondaryAddress } from "../../services/customers";
import { searchAddresses } from "../../services/addresses";
import { extractErrorCode } from "../../services/error";

export const useSearchAddresses = (
  searchInput: string,
  excludedIds: string[],
  includedIds?: string[]
) => {
  const {
    data: addresses,
    error,
    isLoading: loading,
  } = useSWR<
    CustomerSecondaryAddress[],
    Error,
    readonly [string, string, string[], string[] | undefined] | null
  >(
    searchInput.length > 0 || includedIds?.length
      ? ["search-addresses", searchInput, excludedIds, includedIds]
      : null,
    async ([_operation, searchInput, excludedIds, includedIds]) =>
      searchAddresses(searchInput, excludedIds, includedIds)
  );

  return {
    addresses,
    error: extractErrorCode(error),
    loading,
  };
};
