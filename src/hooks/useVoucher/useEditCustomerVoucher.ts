import useSWRMutation from "swr/mutation";
import { Customer, VoucherDetail, editVoucher } from "../../services/customers";
import { extractErrorCode } from "../../services/error";
import { VoucherFormValues } from "../../components/VoucherForm/VoucherForm";

export const useEditCustomerVoucher = (id: string | undefined) => {
  const { trigger, isMutating, error } = useSWRMutation<
    VoucherDetail,
    Error,
    readonly [string, string] | null,
    VoucherFormValues,
    Customer | null
  >(
    id ? ["customer", id] : null,
    async ([_operation, id], { arg: formValues }) =>
      editVoucher(id, formValues),
    {
      revalidate: false,
      populateCache: (voucher, customer) => {
        if (!customer) return null;
        if (!voucher)
          return {
            ...customer,
            voucher: undefined,
          };
        return {
          ...customer,
          voucher,
        };
      },
    }
  );

  return {
    editCustomerVoucher: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
