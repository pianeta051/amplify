import useSWR from "swr";
import { Customer, getCustomer } from "../../services/customers";
import { extractErrorCode } from "../../services/error";

export const useCustomer = (id: string | undefined) => {
  const { data, isLoading, error } = useSWR<
    // Hook de SWR para hacer un GET
    Customer | null, // Lo que devuelv el metodo del servicio
    Error, // El error que lanza el metodo del servicio
    readonly [string, string] | null // Tipo de la clave
  >(
    id ? ["customer", id] : null, // Clave
    async ([_operation, customerId]) => getCustomer(customerId) // Funcion que recibe la key y llama al metodo del servicio
  );

  return {
    customer: data,
    error: extractErrorCode(error),
    loading: isLoading,
  };
};
