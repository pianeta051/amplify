import useSWR from "swr";
import { CustomerAddress, getSecondaryAddress } from "../../services/customers";
import { extractErrorCode } from "../../services/error";

export const useCustomerSecondaryAddress = (
  customerId: string,
  addressId: string
) => {
  const {
    data: secondaryAddress,
    error,
    isLoading: loading,
  } = useSWR<CustomerAddress, Error, readonly [string, string, string] | null>(
    customerId ? ["customer-secondary-address", customerId, addressId] : null,
    async ([_operation, customerId, addressId]) =>
      getSecondaryAddress(customerId, addressId)
  );

  return {
    secondaryAddress,
    error: extractErrorCode(error),
    loading,
  };
};
