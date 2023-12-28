import { FC, ReactNode, useState } from "react";
import {
  Customer,
  CustomerAddress,
  TaxData,
  VoucherDetail,
} from "../../services/customers";
import { CustomersContext } from "../../context/CustomersContext";
import {
  getCustomers as getCustomersFromService,
  getCustomer as getCustomerFromService,
  editCustomer as editCustomerFromService,
  createCustomer as createCustomerFromService,
  deleteCustomer as deleteCustomerFromService,
  addTaxData as addTaxDataFromService,
  addVoucher as addVoucherFromService,
  deleteCustomerTaxData as deleteCustomerTaxDataFromService,
  deleteCustomerVoucher as deleteCustomerVoucherFromService,
  editTaxData as editTaxDataFromService,
  editVoucher as editVoucherFromService,
  addMainAddress as addMainAddressFromService,
} from "../../services/customers";
import { CustomerFormValues } from "../CustomerForm/CustomerForm";
import { TaxDataFormValues } from "../TaxDataForm/TaxDataForm";
import { VoucherFormValues } from "../VoucherForm/VoucherForm";
import { CustomerAddressFormValues } from "../CustomerAddressForm/CustomerAddressForm";

type CustomersProviderProps = {
  children?: ReactNode;
};

const MINUTES_TO_EXPIRE = 1;

const expirationDate = (minutesFromNow: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesFromNow);
  return date;
};

const isExpired = (expiresAt: Date) => {
  return expiresAt < new Date();
};

export const CustomersProvider: FC<CustomersProviderProps> = ({ children }) => {
  const [customersCollectionStore, setCustomersCollectionStore] = useState<
    Record<
      string,
      {
        response: {
          customers: Customer[];
          nextToken?: string;
        };
        expiresAt: Date;
      }
    >
  >({});

  const [singleCustomerStore, setSingleCustomerStore] = useState<
    Record<string, { response: Customer | null; expiresAt: Date }>
  >({});

  const getCustomers = async (
    nextToken?: string,
    searchInput?: string,
    customerTypes?: string[]
  ): Promise<{
    customers: Customer[];
    nextToken?: string;
  }> => {
    const args = JSON.stringify({ nextToken, searchInput, customerTypes });
    if (
      customersCollectionStore[args] &&
      !isExpired(customersCollectionStore[args].expiresAt)
    ) {
      return customersCollectionStore[args].response;
    }
    const response = await getCustomersFromService(
      nextToken,
      searchInput,
      customerTypes
    );
    setCustomersCollectionStore((customersCollectionStore) => ({
      ...customersCollectionStore,
      [args]: {
        response,
        expiresAt: expirationDate(MINUTES_TO_EXPIRE),
      },
    }));
    return response;
  };

  const getCustomer = async (id: string): Promise<Customer | null> => {
    const args = JSON.stringify({ id });
    if (
      singleCustomerStore[args] &&
      !isExpired(singleCustomerStore[args].expiresAt)
    ) {
      return singleCustomerStore[args].response;
    }
    const response = await getCustomerFromService(id);
    setSingleCustomerStore((singleCustomerStore) => ({
      ...singleCustomerStore,
      [args]: { response, expiresAt: expirationDate(MINUTES_TO_EXPIRE) },
    }));
    return response;
  };

  const editCustomer = async (
    id: string,
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setSingleCustomerStore({});
    setCustomersCollectionStore({});
    return editCustomerFromService(id, formValues);
  };

  const createCustomer = async (
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setCustomersCollectionStore({});
    return createCustomerFromService(formValues);
  };

  const deleteCustomer = async (id: string): Promise<void> => {
    setCustomersCollectionStore({});
    return deleteCustomerFromService(id);
  };

  const deleteCustomerTaxData = async (id: string): Promise<void> => {
    setSingleCustomerStore({});
    return deleteCustomerTaxDataFromService(id);
  };

  const addTaxData = async (
    customerId: string,
    formValues: TaxDataFormValues
  ): Promise<TaxData> => {
    setSingleCustomerStore({});
    return addTaxDataFromService(customerId, formValues);
  };
  const editTaxData = async (
    customerId: string,
    formValues: TaxDataFormValues
  ): Promise<TaxData> => {
    setSingleCustomerStore({});
    return editTaxDataFromService(customerId, formValues);
  };

  const editVoucher = async (
    customerId: string,
    formValues: VoucherFormValues
  ): Promise<VoucherDetail> => {
    setSingleCustomerStore({});
    return editVoucherFromService(customerId, formValues);
  };
  const deleteCustomerVoucher = async (id: string): Promise<void> => {
    setSingleCustomerStore({});
    return deleteCustomerVoucherFromService(id);
  };
  const addVoucher = async (
    customerId: string,
    formValues: VoucherFormValues
  ): Promise<VoucherDetail> => {
    setSingleCustomerStore({});
    return addVoucherFromService(customerId, formValues);
  };

  const addMainAddress = async (
    customerId: string,
    formValues: CustomerAddressFormValues
  ): Promise<CustomerAddress> => {
    setSingleCustomerStore({});
    return addMainAddressFromService(customerId, formValues);
  };

  return (
    <CustomersContext.Provider
      value={{
        getCustomers,
        getCustomer,
        editCustomer,
        createCustomer,
        deleteCustomer,
        deleteCustomerTaxData,
        deleteCustomerVoucher,
        addTaxData,
        addVoucher,
        editTaxData,
        editVoucher,
        addMainAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
