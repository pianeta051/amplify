import { FC, ReactNode } from "react";
import { CustomersContext } from "../../context/CustomersContext";
import { deleteCustomerMainAddress as deleteCustomerMainAddressFromService } from "../../services/customers";

type CustomersProviderProps = {
  children?: ReactNode;
};

export const CustomersProvider: FC<CustomersProviderProps> = ({ children }) => {
  const deleteCustomerMainAddress = async (
    customerId: string
  ): Promise<void> => {
    return deleteCustomerMainAddressFromService(customerId);
  };

  return (
    <CustomersContext.Provider
      value={{
        deleteCustomerMainAddress,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};
