import { createContext, useContext } from "react";

export type CustomersContextData = {
  deleteCustomerMainAddress: (id: string) => Promise<void>;
};

export const CustomersContext = createContext<CustomersContextData>({
  deleteCustomerMainAddress: () => Promise.resolve(),
});

export const useCustomers = () => useContext(CustomersContext);
