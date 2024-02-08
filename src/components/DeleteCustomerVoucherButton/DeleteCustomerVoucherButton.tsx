import LoadingButton from "@mui/lab/LoadingButton";
import { FC } from "react";

import { ErrorCode } from "../../services/error";
import { useDeleteVoucher } from "../../hooks/useVoucher/useDeleteVoucher";

type DeleteCustomerVoucherButtonProps = {
  customerId: string;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerVoucherButton: FC<
  DeleteCustomerVoucherButtonProps
> = ({ customerId, onError }) => {
  const { deleteCustomerVoucher, loading, error } =
    useDeleteVoucher(customerId);

  const deleteHandler = () => {
    deleteCustomerVoucher().catch(() => {
      if (error) {
        onError(error);
      }
    });
  };

  return (
    <LoadingButton
      variant="contained"
      color="error"
      onClick={deleteHandler}
      loading={loading}
    >
      Delete
    </LoadingButton>
  );
};
