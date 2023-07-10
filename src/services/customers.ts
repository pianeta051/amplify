import { API } from "aws-amplify";
import { CreateCustomerFormValues } from "../components/CreateCustomerForm/CreateCustomerForm";

const get = async (
  path: string,
  queryParams: { [param: string]: string } = {}
) => {
  return API.get("dataapi", path, {
    queryStringParameters: queryParams,
  });
};

const post = async (path: string, body: { [param: string]: string } = {}) => {
  return API.post("dataapi", path, {
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
    CUSTOMER_TYPES.includes((value as Customer)["type"] as CustomerType)
  );
};

export const createCustomer = async (
  formValues: CreateCustomerFormValues
): Promise<Customer> => {
  const response = await post("/customers", formValues);
  if (!isCustomer(response.customer)) {
    throw new Error("INTERNAL_ERROR");
  }
  return response.customer;
};

export const getCustomers = async () => {
  const response = await get("/customers");
  if (!("customers" in response) || !Array.isArray(response.customers)) {
    throw new Error("INTERNAL_ERROR");
  }
  for (const customer of response.customers) {
    if (!isCustomer(customer)) {
      throw new Error("INTERNAL_ERROR");
    }
  }
  return response.customers;
};

export const getCustomer = async (id: string): Promise<Customer> => {
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
