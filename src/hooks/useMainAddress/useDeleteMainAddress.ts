import {
  CustomerAddress,
  CustomerSecondaryAddress,
  deleteCustomerMainAddress,
} from "../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "../useAddress/useCustomerAddresses";

export const useDeleteMainAddress = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    CustomerAddress | null
  >(
    id ? ["main-address", id] : null,
    async ([_operation, id]) => {
      await deleteCustomerMainAddress(id);
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
    },
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteCustomerMainAddress: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
