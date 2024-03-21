import useSWRMutation from "swr/mutation";
import { Customer, editCustomerExternalLink } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { CustomerExternalLinkFormValues } from "../../components/CustomerExternalLinkForm/CustomerExternalLinkForm";
export const useEditCustomerExternalLink = (customerId: string | undefined) => {
  const {
    trigger,
    isMutating: loading,
    error,
  } = useSWRMutation<
    // tipo de retorno del servicio
    { url: string; index: number },
    Error,
    readonly [string, string] | null,
    // que datos necesita mi funcion aparte de la clave?
    { formValues: CustomerExternalLinkFormValues; index: number },
    // tipo de la cache
    Customer | null
  >(
    customerId ? ["customer", customerId] : null,
    async ([_operation, customerId], { arg: { formValues, index } }) =>
      editCustomerExternalLink(customerId, formValues, index),
    {
      revalidate: false,
      populateCache: ({ url, index }, customer) => {
        if (!customer) {
          return null;
        }
        if (!customer.externalLinks) {
          return customer;
        }
        customer.externalLinks[index] = url;
        return customer;
      },
    }
  );

  return {
    editCustomerExternalLink: trigger,
    loading,
    error: extractErrorCode(error),
  };
};
