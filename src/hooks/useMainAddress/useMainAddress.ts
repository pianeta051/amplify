import useSWR from "swr";
import { CustomerAddress, getMainAddress } from "../../services/customers";
import { extractErrorCode } from "../../services/error";

export const useMainAddress = (id: string | undefined) => {
  const { data, isLoading, error } = useSWR<
    CustomerAddress | null,
    Error,
    readonly [string, string] | null
  >(id ? ["main-address", id] : null, async ([_operation, id]) =>
    getMainAddress(id)
  );

  return {
    mainAddress: data,
    loading: isLoading,
    error: extractErrorCode(error),
  };
};
