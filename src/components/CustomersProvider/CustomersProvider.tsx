import { FC, ReactNode, useState } from "react";
import {
  Customer,
  CustomerAddress,
  VoucherDetail,
} from "../../services/customers";
import { CustomersContext } from "../../context/CustomersContext";
import {
  getCustomers as getCustomersFromService,
  editCustomer as editCustomerFromService,
  addVoucher as addVoucherFromService,
  deleteCustomerVoucher as deleteCustomerVoucherFromService,
  editVoucher as editVoucherFromService,
  editMainAddress as editMainAddressFromService,
  addMainAddress as addMainAddressFromService,
  getMainAddress as getMainAddressFromService,
  deleteCustomerMainAddress as deleteCustomerMainAddressFromService,
} from "../../services/customers";
import { CustomerFormValues } from "../CustomerForm/CustomerForm";
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

  const [mainAddressStore, setMainAddressStore] = useState<
    Record<string, { response: CustomerAddress | null; expiresAt: Date }>
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

  const getMainAddress = async (
    customerId: string
  ): Promise<CustomerAddress | null> => {
    const args = JSON.stringify({ customerId });
    if (
      mainAddressStore[args] &&
      !isExpired(mainAddressStore[args].expiresAt)
    ) {
      return mainAddressStore[args].response;
    }
    const response = await getMainAddressFromService(customerId);
    const expiresAt = expirationDate(MINUTES_TO_EXPIRE);
    setMainAddressStore((mainAddressStore) => ({
      ...mainAddressStore,
      [args]: { response, expiresAt },
    }));
    return response;
  };

  const editCustomer = async (
    id: string,
    formValues: CustomerFormValues
  ): Promise<Customer> => {
    setCustomersCollectionStore({});
    return editCustomerFromService(id, formValues);
  };

  const editVoucher = async (
    customerId: string,
    formValues: VoucherFormValues
  ): Promise<VoucherDetail> => {
    return editVoucherFromService(customerId, formValues);
  };
  const editMainAddress = async (
    customerId: string,
    formValues: CustomerAddressFormValues
  ): Promise<CustomerAddress> => {
    setMainAddressStore({});
    return editMainAddressFromService(customerId, formValues);
  };
  const deleteCustomerVoucher = async (id: string): Promise<void> => {
    return deleteCustomerVoucherFromService(id);
  };
  const addVoucher = async (
    customerId: string,
    formValues: VoucherFormValues
  ): Promise<VoucherDetail> => {
    return addVoucherFromService(customerId, formValues);
  };

  const addMainAddress = async (
    customerId: string,
    formValues: CustomerAddressFormValues
  ): Promise<CustomerAddress> => {
    setMainAddressStore({});
    return addMainAddressFromService(customerId, formValues);
  };

  const deleteCustomerMainAddress = async (
    customerId: string
  ): Promise<void> => {
    setMainAddressStore({});
    return deleteCustomerMainAddressFromService(customerId);
  };

  return (
    <CustomersContext.Provider
      value={{
        getCustomers,
        editCustomer,
        editMainAddress,
        deleteCustomerVoucher,
        addVoucher,
        editVoucher,
        addMainAddress,
        getMainAddress,
        deleteCustomerMainAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
