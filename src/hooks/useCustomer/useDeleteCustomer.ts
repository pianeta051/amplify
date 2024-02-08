import { Customer, deleteCustomer } from "../../services/customers";
import useSWRMutation from "swr/mutation";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";

export const useDeleteCustomer = (id: string | undefined) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void, // Lo que devuelve el metodo del servicio
    Error, // Error del metodo del servicio
    readonly [string, string] | null, // Tipo de la clave
    never, // Argumentos del metodo del servicio (aparte del ID)
    Customer | null // Lo que tiene que haber dentro de la cache
  >(
    id ? ["customer", id] : null, // Clave: TIENE QUE SER LA MISMA CUYA CACHE QUEREMOS EDITAR
    async ([_operation, id]) => {
      await deleteCustomer(id);
      await mutate<
        readonly [
          string,
          string | undefined,
          string | undefined,
          string[] | undefined
        ],
        {
          customers: Customer[];
          nextToken?: string;
        }
      >(
        (key) => Array.isArray(key) && key.length > 0 && key[0] === "customers",
        undefined,
        { populateCache: true, revalidate: false }
      );
    },
    {
      revalidate: false, // No sigas enviando esta peticion periodicamente
      populateCache: () => null, // Lo que te devuelva esta funcion, metelo en la cache del GET
    } // Opciones de configuracion
  );

  return {
    deleteCustomer: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
