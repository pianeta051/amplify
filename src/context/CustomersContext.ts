import { createContext, useContext } from "react";
import {
  Customer,
  TaxData,
  VoucherDetail,
  deleteCustomerTaxData,
} from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../components/TaxDataForm/TaxDataForm";
import { VoucherFormValues } from "../components/VoucherForm/VoucherForm";

export type CustomersContextData = {
  getCustomers: (
    nextToken?: string,
    searchInput?: string,
    customerTypes?: string[]
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
  deleteCustomer: (id: string) => Promise<void>;
  deleteCustomerTaxData: (id: string) => Promise<void>;
  addTaxData: (
    customerId: string,
    formValues: TaxDataFormValues
  ) => Promise<TaxData>;
  editTaxData: (
    customerId: string,
    formValues: TaxDataFormValues
  ) => Promise<TaxData>;
  addVoucher: (
    customerId: string,
    formValues: VoucherFormValues
  ) => Promise<VoucherDetail>;
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
  deleteCustomer: () => Promise.resolve(),
  deleteCustomerTaxData: () => Promise.resolve(),
  addTaxData: () =>
    Promise.resolve({
      taxId: "2",
      companyName: "ADDLL",
      companyAddress: "Silos 12",
    }),
  editTaxData: () =>
    Promise.resolve({
      taxId: "2",
      companyName: "ADDLL",
      companyAddress: "Silos 12",
    }),
  addVoucher: () =>
    Promise.resolve({
      voucherId: "2",
      value: 100,
      type: "absolute",
    }),
});

export const useCustomers = () => useContext(CustomersContext);
