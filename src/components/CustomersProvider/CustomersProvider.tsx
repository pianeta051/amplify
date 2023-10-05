import { FC, ReactNode, useState } from "react";
import { Customer } from "../../services/customers";
import { CustomersContext } from "../../context/CustomersContext";
import {
  getCustomers as getCustomersFromService,
  getCustomer as getCustomerFromService,
  editCustomer as editCustomerFromService,
  createCustomer as createCustomerFromService,
} from "../../services/customers";
import { CustomerFormValues } from "../CustomerForm/CustomerForm";

type CustomersProviderProps = {
  children?: ReactNode;
};

export const CustomersProvider: FC<CustomersProviderProps> = ({ children }) => {
  const [getCustomersStore, setGetCustomersStore] = useState<
    Record<
      string,
      {
        response: {
          customers: Customer[];
          nextToken?: string;
        };
        validUntil: Date;
      }
    >
  >({});

  const [getCustomerStore, setGetCustomerStore] = useState<
    Record<string, Customer | null>
  >({});

  const getCustomers = async (
    nextToken?: string,
    searchInput?: string,
    customerType?: string
  ): Promise<{
    customers: Customer[];
    nextToken?: string;
  }> => {
    const args = JSON.stringify({ nextToken, searchInput, customerType });
    if (
      getCustomersStore[args] &&
      getCustomersStore[args].validUntil > new Date()
    ) {
      return getCustomersStore[args].response;
    }
    const response = await getCustomersFromService(
      nextToken,
      searchInput,
      customerType
    );
    setGetCustomersStore((getCustomersStore) => ({
      ...getCustomersStore,
      [args]: {
        response,
        validUntil: new Date(new Date().getTime() + 60000),
      },
    }));
    return response;
  };

  const getCustomer = async (id: string): Promise<Customer | null> => {
    const args = JSON.stringify({ id });
    if (getCustomerStore[args]) {
      return getCustomerStore[args];
    }
    const response = await getCustomerFromService(id);
    setGetCustomerStore((getCustomerStore) => ({
      ...getCustomerStore,
      [args]: response,
    }));
    return response;
  };

  const editCustomer = async (
    id: string,
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setGetCustomerStore({});
    setGetCustomersStore({});
    return editCustomerFromService(id, formValues);
  };

  const createCustomer = async (
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setGetCustomersStore({});
    return createCustomerFromService(formValues);
  };

  return (
    <CustomersContext.Provider
      value={{ getCustomers, getCustomer, editCustomer, createCustomer }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
