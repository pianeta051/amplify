import { get } from "./api";
import { CustomerSecondaryAddress, isCustomerAddress } from "./customers";

export const searchAddresses = async (
  searchInput: string,
  excludedIds?: string[],
  includedIds?: string[]
): Promise<CustomerSecondaryAddress[]> => {
  try {
    const response = await get("/addresses", {
      search: searchInput,
      excludedIds: excludedIds?.join(","),
      includedIds: includedIds?.join(","),
    });
    if (
      !response.addresses ||
      !Array.isArray(response.addresses) ||
      response.addresses.some((element: unknown) => !isCustomerAddress(element))
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.addresses;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJobAddresses = async (
  jobId: string,
  nextToken?: string
): Promise<{ addresses: CustomerSecondaryAddress[]; nextToken?: string }> => {
  try {
    const response = await get(`/jobs/${jobId}/addresses`, { nextToken });
    if (
      !response.addresses ||
      !Array.isArray(response.addresses) ||
      response.addresses.some(
        (element: unknown) => !isCustomerAddress(element)
      ) ||
      (response.nextToken !== undefined &&
        typeof response.nextToken !== "string")
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return response;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};
