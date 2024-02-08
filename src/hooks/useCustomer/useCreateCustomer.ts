import useSWRMutation from "swr/mutation";
import { Customer, createCustomer } from "../../services/customers";
import { CustomerFormValues } from "../../components/CustomerForm/CustomerForm";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";

export const useCreateCustomer = () => {
  const { mutate } = useSWRConfig();
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
    ) => {
      const customer = await createCustomer(formValues);
      // Ahora que sabemos el id, modificamos la cache [customer, id]
      await mutate<readonly [string, string], Customer>(
        ["customer", customer.id],
        customer,
        { populateCache: true, revalidate: false }
      );
      return customer;
    },
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
