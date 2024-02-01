import useSWRMutation from "swr/mutation";
import { Customer, TaxData, addTaxData } from "../services/customers";
import { extractErrorCode } from "../services/error";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";

export const useAddCustomerTaxData = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    TaxData,
    Error,
    readonly [string, string] | null,
    TaxDataFormValues,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, id], { arg: formValues }) => addTaxData(id, formValues),
    {
      revalidate: false,
      populateCache: (taxData, customer) => {
        if (!customer) return null;
        if (!taxData)
          return {
            ...customer,
            taxData: undefined,
          };
        return {
          ...customer,
          taxData,
        };
      },
    }
  );

  return {
    addCustomerTaxData: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
