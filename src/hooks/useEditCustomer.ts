import useSWRMutation from "swr/mutation";
import { Customer, editCustomer } from "../services/customers";
import { CustomerFormValues } from "../components/CustomerForm/CustomerForm";
import { extractErrorCode } from "../services/error";

export const useEditCustomer = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    Customer, // Lo que devuelve el metodo del servicio
    Error, // Error del metodo del servicio
    readonly [string, string] | null, // Tipo de la clave
    CustomerFormValues // Argumentos del metodo del servicio (aparte del ID)
  >(
    id ? ["customer", id] : null, // Clave: TIENE QUE SER LA MISMA CUYA CACHE QUEREMOS EDITAR
    async (
      [_operation, id],
      { arg: formValues } // Recibe primero el array de la clave y luego un objeto con los argumentos
    ) => editCustomer(id, formValues), // Funcion del servicio
    {
      revalidate: false, // No sigas enviando esta peticion periodicamente
      populateCache: true, // Lo que te devuelva el servicio, metelo en la cache del GET
    } // Opciones de configuracion
  );

  return {
    editCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
