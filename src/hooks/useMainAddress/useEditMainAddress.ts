import useSWRMutation from "swr/mutation";
import {
  CustomerAddress,
  CustomerSecondaryAddress,
  editMainAddress,
} from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { CustomerAddressFormValues } from "../../components/CustomerAddressForm/CustomerAddressForm";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../useAddress/useCustomerAddresses";

export const useEditMainAddress = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerAddress,
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues,
    CustomerAddress | null
  >(
    id ? ["main-address", id] : null,
    async ([_operation, id], { arg: formValues }) => {
      const address = editMainAddress(id, formValues);
      await mutate<
        readonly [string, string, string | undefined],
        {
          items: CustomerSecondaryAddress[];
          nextToken?: string;
        } | null
      >(
        // Temporary solution: https://github.com/vercel/swr/issues/1156
        unstable_serialize(keyFunctionGenerator(id)),
        () => undefined,
        {
          revalidate: true,
          populateCache: false,
        }
      );
      return address;
    },
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
