import useSWRMutation from "swr/mutation";
import { Customer, deleteExternalLink } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
export const useDeleteCustomerExternalLink = (customerId: string) => {
  const {
    trigger,
    isMutating: loading,
    error,
  } = useSWRMutation<
    number,
    Error,
    readonly [string, string],
    number,
    Customer | null
  >(
    ["customer", customerId],
    async ([_operation, customerId], { arg: index }) =>
      deleteExternalLink(customerId, index),
    {
      revalidate: false,
      populateCache: (index, customer) => {
        if (!customer?.externalLinks) return null;
        customer.externalLinks.splice(index, 1);
        return customer;
      },
    }
  );

  // Completa el return
  return {
    deleteCustomerExternalLink: trigger,
    loading,
    error: extractErrorCode(error),
  };
};
