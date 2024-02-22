import {
  CustomerAddress,
  deleteCustomerMainAddress,
} from "../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";

export const useDeleteMainAddress = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    CustomerAddress | null
  >(
    id ? ["main-address", id] : null,
    async ([_operation, id]) => deleteCustomerMainAddress(id),
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteCustomerMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
