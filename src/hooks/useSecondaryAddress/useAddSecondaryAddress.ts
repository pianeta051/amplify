import useSWRMutation from "swr/mutation";
import {
  CustomerSecondaryAddress,
  addSecondaryAddress,
} from "../../services/customers";
import { CustomerAddressFormValues } from "../../components/CustomerAddressForm/CustomerAddressForm";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../useAddress/useCustomerAddresses";
export const useAddSecondaryAddress = (customerId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    CustomerSecondaryAddress, // lo que devuelve el metodo del servicio
    Error,
    readonly [string, string] | null,
    CustomerAddressFormValues
  >(
    ["add-customer-secondary-address", customerId],
    async (_operation, { arg: formValues }) => {
      const address = await addSecondaryAddress(customerId, formValues);
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
      populateCache: false,
    }
  );

  return {
    addSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
