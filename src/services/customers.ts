import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";
import { VoucherFormValues } from "../components/VoucherForm/VoucherForm";

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

const put = async (path: string, body: { [param: string]: string } = {}) => {
  return API.put("dataapi", path, {
    body,
  });
};

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

export const CUSTOMER_TYPES = ["individual", "company", "other"] as const;
export type CustomerType = typeof CUSTOMER_TYPES[number];
export type Customer = {
  id: string;
  name: string;
  email: string;
  type: CustomerType;
  taxData?: TaxData;
  voucherDetail?: VoucherDetail;
};

export type TaxData = {
  taxId: string;
  companyName: string;
  companyAddress: string;
};

export const VOUCHER_TYPES = ["percentage", "absolute"] as const;
export type VoucherType = typeof VOUCHER_TYPES[number];
export type VoucherDetail = {
  voucherId: string;
  value: number;
  type: VoucherType;
};

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
      (value as Customer).taxData === undefined)
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

export const deleteCustomerTaxData = async (
  customerId: string
): Promise<void> => {
  await del(`/customers/${customerId}/tax-data`);
};

export const editTaxData = async (
  customerId: string,
  formValues: TaxDataFormValues
): Promise<TaxData> => {
  return formValues;
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

//este codigo es un ejemplo de lo que hay que hacer.... hay que adaptarlo
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
