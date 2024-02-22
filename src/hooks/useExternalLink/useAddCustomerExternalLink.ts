import useSWRMutation from "swr/mutation";
import { Customer, addExternalLink } from "../../services/customers";
import { CustomerExternalLinkFormValues } from "../../components/CustomerExternalLinkForm/CustomerExternalLinkForm";
import { extractErrorCode } from "../../services/error";

export const useAddCustomerExternalLink = (customerId: string) => {
  const {
    trigger,
    isMutating: loading,
    error,
  } = useSWRMutation<
    string,
    Error,
    readonly [string, string],
    CustomerExternalLinkFormValues,
    Customer | null
  >(
    ["customer", customerId],
    async ([_operation, customerId], { arg: { url } }) =>
      addExternalLink(customerId, url),
    {
      revalidate: false,
      populateCache: (url, customer) => {
        if (!customer) {
          return null;
        }
        if (!customer.externalLinks) {
          return {
            ...customer,
            externalLinks: [url],
          };
        }
        return {
          ...customer,
          externalLinks: [...customer.externalLinks, url],
        };
      },
    }
  );

  return {
    addExternalLink: trigger,
    loading,
    error: extractErrorCode(error),
  };
};
