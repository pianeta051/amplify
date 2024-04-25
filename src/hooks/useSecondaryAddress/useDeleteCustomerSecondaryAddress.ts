import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import {
  CustomerSecondaryAddress,
  deleteSecondaryAddress,
} from "../../services/customers";
import { keyFunctionGenerator } from "./useCustomerSecondaryAddresses";
import { unstable_serialize } from "swr/infinite";
import { extractErrorCode } from "../../services/error";

export const useDeleteCustomerSecondaryAddress = (customerId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    string
  >(
    ["delete-customer-secondary-address", customerId],
    async (_operation, { arg: addressId }) => {
      await deleteSecondaryAddress(customerId, addressId);
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
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );
  return {
    deleteSecondaryAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
