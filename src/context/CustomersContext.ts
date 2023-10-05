import { createContext, useContext } from "react";
import { Customer } from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string,
    searchButton?: string
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  getCustomer: (id: string) => Promise<Customer | null>;
  editCustomer: (
    id: string,
    formValues: CustomerFormValues
  ) => Promise<Customer>;
  createCustomer: (formValues: CustomerFormValues) => Promise<Customer>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  getCustomer: () => Promise.resolve(null),
  editCustomer: () =>
    Promise.resolve({
      id: "1",
      name: "Default",
      email: "Default",
      type: "company",
    }),
  createCustomer: () =>
    Promise.resolve({
      id: "1",
      name: "Default",
      email: "Default",
      type: "company",
    }),
});

export const useCustomers = () => useContext(CustomersContext);
