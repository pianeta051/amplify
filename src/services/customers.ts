import { API } from "aws-amplify";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";

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

const post = async (path: string, body: { [param: string]: string } = {}) => {
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

export const getCustomers = async (
  nextToken?: string,
  searchInput?: string
): Promise<{
  customers: Customer[];
  nextToken?: string;
}> => {
  const response = await get("/customers", { nextToken, search: searchInput });
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
