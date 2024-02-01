import { createContext, useContext } from "react";
import {
  Customer,
  CustomerAddress,
  VoucherDetail,
} from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { VoucherFormValues } from "../components/VoucherForm/VoucherForm";
import { CustomerAddressFormValues } from "../components/CustomerAddressForm/CustomerAddressForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string,
    customerTypes?: string[]
  ) => Promise<{
    customers: Customer[];
    nextToken?: string;
  }>;
  editCustomer: (
    id: string,
    formValues: CustomerFormValues
  ) => Promise<Customer>;

  addVoucher: (
    customerId: string,
    formValues: VoucherFormValues
  ) => Promise<VoucherDetail>;
  addMainAddress: (
    customerId: string,
    formValues: CustomerAddressFormValues
  ) => Promise<CustomerAddress>;
  editVoucher: (
    customerId: string,
    formValues: VoucherFormValues
  ) => Promise<VoucherDetail>;
  editMainAddress: (
    customerId: string,
    formValues: CustomerAddressFormValues
  ) => Promise<CustomerAddress>;
  deleteCustomerVoucher: (id: string) => Promise<void>;
  getMainAddress: (customerId: string) => Promise<CustomerAddress | null>;
  deleteCustomerMainAddress: (id: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  getCustomers: () => Promise.resolve({ customers: [] }),
  editCustomer: () =>
    Promise.resolve({
      id: "1",
      name: "Default",
      email: "Default",
      type: "company",
    }),

  editVoucher: () =>
    Promise.resolve({
      voucherId: "25",
      value: 54,
      type: "absolute",
    }),
  editMainAddress: () =>
    Promise.resolve({
      street: "ddd",
      number: "444",
      city: "ddd",
      postcode: "ddd",
    }),
  addVoucher: () =>
    Promise.resolve({
      voucherId: "2",
      value: 100,
      type: "absolute",
    }),
  deleteCustomerVoucher: () => Promise.resolve(),
  addMainAddress: () => Promise.resolve({} as CustomerAddress),
  getMainAddress: () => Promise.resolve(null),
  deleteCustomerMainAddress: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
