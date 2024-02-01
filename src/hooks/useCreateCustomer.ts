import useSWRMutation from "swr/mutation";
import { Customer, createCustomer } from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { extractErrorCode } from "../services/error";

export const useCreateCustomer = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    Customer,
    Error,
    string,
    CustomerFormValues,
    Customer | null
  >(
    "create-customer",
    async (
      _operation,
      { arg: formValues } // Recibe primero el array de la clave y luego un objeto con los argumentos
    ) => createCustomer(formValues), // Funcion del servicio,
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    createCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
