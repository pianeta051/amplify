import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";
import { VoucherFormValues } from "../components/VoucherForm/VoucherForm";
import { CustomerAddressFormValues } from "../components/CustomerAddressForm/CustomerAddressForm";
import { CustomerExternalLinkFormValues } from "../components/CustomerExternalLinkForm/CustomerExternalLinkForm";

/**
 * GENERAL API FUNCTIONS
 */

const del = async (path: string) => {
  return API.del("dataapi", path, {});
};

const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined } = {}
) => {
  return API.get("dataapi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (
  path: string,
  body: { [param: string]: string | number } = {}
) => {
  return API.post("dataapi", path, {
    body,
  });
};

const put = async (
  path: string,
  body: { [param: string]: string | number } = {}
) => {
  return API.put("dataapi", path, {
    body,
  });
};
/**
 * TYPES AND TYPE GUARDS
 */

export type Customer = {
  id: string;
  name: string;
  email: string;
  type: CustomerType;
  taxData?: TaxData;
  voucher?: VoucherDetail;
  externalLinks?: string[];
};
export const CUSTOMER_TYPES = ["individual", "company", "other"] as const;
export type CustomerType = typeof CUSTOMER_TYPES[number];

type ErrorResponse = {
  response: { status: number };
};

const isErrorResponse = (value: unknown): value is ErrorResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "response" in value &&
    typeof (value as ErrorResponse)["response"] === "object" &&
    (value as ErrorResponse)["response"] !== null &&
    "status" in (value as ErrorResponse)["response"] &&
    typeof (value as ErrorResponse)["response"]["status"] === "number"
  );
};

export type CustomerAddress = {
  street: string;
  number: string;
  city: string;
  postcode: string;
};

export type CustomerSecondaryAddress = CustomerAddress & {
  id: string;
};

export type TaxData = {
  taxId: string;
  companyName: string;
  companyAddress: string;
};

export type VoucherDetail = {
  voucherId: string;
  value: number;
  type: VoucherType;
};
export const VOUCHER_TYPES = ["percentage", "absolute"] as const;
export type VoucherType = typeof VOUCHER_TYPES[number];

const isCustomer = (value: unknown): value is Customer => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as Customer)["id"] === "string" &&
    "name" in value &&
    typeof (value as Customer)["name"] === "string" &&
    "email" in value &&
    typeof (value as Customer)["email"] === "string" &&
    "type" in value &&
    typeof (value as Customer)["type"] === "string" &&
    CUSTOMER_TYPES.includes((value as Customer)["type"] as CustomerType) &&
    ((typeof (value as Customer).taxData === "object" &&
      isTaxData((value as Customer).taxData)) ||
      (value as Customer).taxData === undefined) &&
    ((value as Customer).externalLinks === undefined ||
      Array.isArray((value as Customer).externalLinks))
  );
};

const isCustomerAddress = (value: unknown): value is CustomerAddress => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const customerAddress = value as CustomerAddress;
  return (
    typeof customerAddress.street === "string" &&
    typeof customerAddress.number === "string" &&
    typeof customerAddress.city === "string" &&
    typeof customerAddress.postcode === "string"
  );
};

const isSecondayAddress = (
  value: unknown
): value is CustomerSecondaryAddress => {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const secondaryAddress = value as CustomerSecondaryAddress;

  if (typeof secondaryAddress.id !== "string") {
    return false;
  }
  return isCustomerAddress(value);
};

const isAddress = (value: unknown): value is CustomerAddress => {
  return (
    typeof value === "object" &&
    value !== null &&
    "street" in value &&
    typeof (value as CustomerAddress)["street"] === "string" &&
    "number" in value &&
    typeof (value as CustomerAddress)["number"] === "string" &&
    "city" in value &&
    typeof (value as CustomerAddress)["city"] === "string" &&
    "postcode" in value &&
    typeof (value as CustomerAddress)["postcode"] === "string"
  );
};

const isTaxData = (value: unknown): value is TaxData => {
  return (
    typeof value === "object" &&
    value !== null &&
    "taxId" in value &&
    typeof (value as TaxData)["taxId"] === "string" &&
    "companyName" in value &&
    typeof (value as TaxData)["companyName"] === "string" &&
    "companyAddress" in value &&
    typeof (value as TaxData)["companyAddress"] === "string"
  );
};

const isVoucher = (value: unknown): value is VoucherDetail => {
  return (
    typeof value === "object" &&
    value !== null &&
    "voucherId" in value &&
    typeof (value as VoucherDetail)["voucherId"] === "string" &&
    "value" in value &&
    typeof (value as VoucherDetail)["value"] === "number" &&
    "type" in value &&
    typeof (value as VoucherDetail)["type"] === "string" &&
    VOUCHER_TYPES.includes((value as VoucherDetail)["type"] as VoucherType)
  );
};

/**
 * AJAX FUNCTIONS
 */

export const addExternalLink = async (
  customerId: string,
  url: string
): Promise<string> => {
  try {
    await post(`/customers/${customerId}/external-link`, { url });
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
  return url;
};

export const addMainAddress = async (
  customerId: string,
  formValues: CustomerAddressFormValues
): Promise<CustomerAddress> => {
  try {
    const response = await post(
      `/customers/${customerId}/main-address`,
      formValues
    );
    if (!isCustomerAddress(response.mainAddress)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.mainAddress;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const addSecondaryAddress = async (
  customerId: string,
  formValues: CustomerAddressFormValues
): Promise<CustomerSecondaryAddress> => {
  try {
    const response = await post(
      `/customers/${customerId}/secondary-address`,
      formValues
    );
    if (!isSecondayAddress(response.secondaryAddress)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.secondaryAddress;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const addTaxData = async (
  customerId: string,
  formValues: TaxDataFormValues
): Promise<TaxData> => {
  try {
    const response = await post(
      `/customers/${customerId}/tax-data`,
      formValues
    );
    if (!("taxData" in response) && typeof response.taxData !== "object") {
      throw new Error("INTERNAL_ERROR");
    }
    if (!isTaxData(response.taxData)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.taxData;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 400) {
        throw new Error("TAX_ID_CANNOT_BE_EMPTY");
      }
      if (error.response.status === 404) {
        throw new Error("CUSTOMER_NOT_EXISTS");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const addVoucher = async (
  customerId: string,
  formValues: VoucherFormValues
): Promise<VoucherDetail> => {
  try {
    const response = await post(
      `/customers/${customerId}/voucher-detail`,
      formValues
    );
    if (!("voucher" in response) && typeof response.voucher !== "object") {
      throw new Error("INTERNAL_ERROR");
    }
    if (!isVoucher(response.voucher)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.voucher;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 400) {
        throw new Error("VOUCHER_ID_CANNOT_BE_EMPTY");
      }
      if (error.response.status === 404) {
        throw new Error("CUSTOMER_NOT_EXISTS");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const createCustomer = async (
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    const response = await post("/customers", formValues);
    if (!isCustomer(response.customer)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 409) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
      if (error.response.status === 400) {
        throw new Error("EMAIL_CANNOT_BE_EMPTY");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await del("/customers/" + id);
};

export const deleteCustomerMainAddress = async (id: string): Promise<void> => {
  await del(`/customers/${id}/address_main`);
};

export const deleteCustomerTaxData = async (
  customerId: string
): Promise<void> => {
  await del(`/customers/${customerId}/tax-data`);
};

export const deleteCustomerVoucher = async (
  customerId: string
): Promise<void> => {
  await del(`/customers/${customerId}/voucher-detail`);
};

export const deleteExternalLink = async (customerId: string, index: number) => {
  await del(`/customers/${customerId}/external-link/${index}`);
  return index;
};

export const editCustomer = async (
  id: string,
  formValues: CustomerFormValues
): Promise<Customer> => {
  try {
    const response = await put("/customers/" + id, formValues);
    if (!isCustomer(response.customer)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 409) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
      if (error.response.status === 400) {
        throw new Error("EMAIL_CANNOT_BE_EMPTY");
      }
      if (error.response.status === 404) {
        throw new Error("CUSTOMER_NOT_EXISTS");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const editTaxData = async (
  customerId: string,
  formValues: TaxDataFormValues
): Promise<TaxData> => {
  try {
    const response = await put(`/customers/${customerId}/tax-data`, formValues);
    if (!isTaxData(response.taxData)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.taxData;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const editVoucher = async (
  customerId: string,
  formValues: VoucherFormValues
): Promise<VoucherDetail> => {
  try {
    const response = await put(
      `/customers/${customerId}/voucher-detail`,
      formValues
    );
    if (!isVoucher(response.voucher)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.voucher;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const editMainAddress = async (
  customerId: string,
  formValues: CustomerAddressFormValues
): Promise<CustomerAddress> => {
  try {
    const response = await put(
      `/customers/${customerId}/main-address`,
      formValues
    );
    if (!isAddress(response.mainAddress)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.mainAddress;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const editCustomerExternalLink = async (
  customerId: string,
  formValues: CustomerExternalLinkFormValues,
  index: number
): Promise<{ url: string; index: number }> => {
  try {
    const response = await put(
      `/customers/${customerId}/external-link/${index}`,
      formValues
    );
    return { url: response.url, index };
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getCustomers = async (
  nextToken?: string,
  searchInput?: string,
  customerTypes?: string[]
): Promise<{
  customers: Customer[];
  nextToken?: string;
}> => {
  const response = await get("/customers", {
    nextToken,
    search: searchInput,
    customerTypes: JSON.stringify(customerTypes),
  });
  const customers = response.customers as Customer[];
  const responseToken = response.nextToken as string | undefined;
  if (!("customers" in response) || !Array.isArray(response.customers)) {
    throw new Error("INTERNAL_ERROR");
  }
  for (const customer of response.customers) {
    if (!isCustomer(customer)) {
      throw new Error("INTERNAL_ERROR");
    }
  }
  return { customers, nextToken: responseToken };
};

export const getCustomer = async (id: string): Promise<Customer | null> => {
  try {
    const response = await get(`/customers/${id}`);
    if (!("customer" in response) && typeof response.customer !== "object") {
      throw new Error("INTERNAL_ERROR");
    }
    if (!isCustomer(response.customer)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.customer;
  } catch (error) {
    if (isErrorResponse(error)) {
      if (error.response.status === 404) {
        throw new Error("CUSTOMER_NOT_EXISTS");
      }
    }

    throw new Error("INTERNAL_ERROR");
  }
};

export const getMainAddress = async (
  customerId: string
): Promise<CustomerAddress | null> => {
  try {
    const response = await get(`/customers/${customerId}/main-address`);
    if (
      !isCustomerAddress(response.mainAddress) &&
      response.mainAddress !== null
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.mainAddress;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getSecondaryAddresses = async (
  customerId: string,
  nextToken?: string
): Promise<{ items: CustomerSecondaryAddress[]; nextToken?: string }> => {
  try {
    const response = await get(`/customers/${customerId}/secondary-addresses`, {
      nextToken,
    });
    if (
      !response.secondaryAddresses ||
      !Array.isArray(response.secondaryAddresses) ||
      response.secondaryAddresses.some(
        (element: unknown) => !isCustomerAddress(element)
      ) ||
      (response.nextToken !== undefined &&
        typeof response.nextToken !== "string")
    ) {
      throw new Error("INTERNAL_ERROR");
    }
    return {
      items: response.secondaryAddresses,
      nextToken: response.nextToken,
    };
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 404) {
        throw new Error("CUSTOMER_NOT_FOUND");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};
