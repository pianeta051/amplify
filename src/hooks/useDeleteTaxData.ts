import { Customer, deleteCustomerTaxData } from "../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../services/error";

export const useDeleteTaxData = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, id]) => deleteCustomerTaxData(id),
    {
      revalidate: false,
      populateCache: (_taxData, customer) => {
        if (!customer) return null;
        return {
          ...customer,
          taxData: undefined,
        };
      },
    }
  );

  return {
    deleteCustomerTaxData: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
