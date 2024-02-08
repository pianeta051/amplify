import useSWRMutation from "swr/mutation";
import { CustomerAddress, editMainAddress } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { CustomerAddressFormValues } from "../../components/CustomerAddressForm/CustomerAddressForm";

export const useEditMainAddress = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerAddress,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues,
    CustomerAddress | null
  >(
    id ? ["main-address", id] : null,
    async ([_operation, id], { arg: formValues }) =>
      editMainAddress(id, formValues),
    {
      revalidate: false,
      populateCache: true,
    }
  );

  return {
    editMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
