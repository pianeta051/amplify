import useSWRMutation from "swr/mutation";
import {
  CustomerSecondaryAddress,
  editCustomerSecondaryAddress,
} from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { CustomerAddressFormValues } from "../../components/CustomerAddressForm/CustomerAddressForm";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../useAddress/useCustomerAddresses";

export const useEditCustomerSecondaryAddress = (
  customerId: string | undefined,
  addressId: string | undefined
) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerSecondaryAddress,
    Error,
    readonly [string, string, string] | null,
    CustomerAddressFormValues
  >(
    addressId && customerId
      ? ["customer-secondary-address", customerId, addressId]
      : null,
    async ([_operation, customerId, addressId], { arg: formValues }) => {
      const address = editCustomerSecondaryAddress(
        customerId,
        addressId,
        formValues
      );
      await mutate<
        readonly [string, string, string | undefined],
        {
          items: CustomerSecondaryAddress[];
          nextToken?: string;
        } | null
      >(
        // Temporary solution: https://github.com/vercel/swr/issues/1156
        unstable_serialize(keyFunctionGenerator(customerId)),
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
    editCustomerSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
