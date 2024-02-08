import { Customer, deleteCustomerVoucher } from "../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";

export const useDeleteVoucher = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, id]) => deleteCustomerVoucher(id),
    {
      revalidate: false,
      populateCache: (_voucher, customer) => {
        if (!customer) return null;
        return {
          ...customer,
          voucher: undefined,
        };
      },
    }
  );

  return {
    deleteCustomerVoucher: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
