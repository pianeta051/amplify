import useSWRMutation from "swr/mutation";
import { Customer, TaxData, editTaxData } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { TaxDataFormValues } from "../../components/TaxDataForm/TaxDataForm";

export const useEditCustomerTaxData = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    TaxData, // Lo que devuelve el metodo del servicio
    Error, // Error del metodo del servicio
    readonly [string, string] | null, // Tipo de la clave
    TaxDataFormValues, // Argumentos del metodo del servicio (aparte del ID)
    Customer | null // Lo que tiene que haber dentro de la cache
  >(
    id ? ["customer", id] : null, // Clave: TIENE QUE SER LA MISMA CUYA CACHE QUEREMOS EDITAR
    async (
      [_operation, id],
      { arg: formValues } // Recibe primero el array de la clave y luego un objeto con los argumentos
    ) => editTaxData(id, formValues), // Funcion del servicio
    {
      revalidate: false, // No sigas enviando esta peticion periodicamente
      populateCache: (taxData, customer) => {
        // Devuelves la nueva cache
        // Hilar mas fino a la hora de gestionar la cache
        if (!customer) return null;
        if (!taxData)
          return {
            ...customer,
            taxData: undefined,
          };
        return {
          ...customer,
          taxData,
        };
      },
    } // Opciones de configuracion
  );

  return {
    editCustomerTaxData: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
