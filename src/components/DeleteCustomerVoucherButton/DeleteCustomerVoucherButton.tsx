import LoadingButton from "@mui/lab/LoadingButton";
import { FC, useState } from "react";
import { useCustomers } from "../../context/CustomersContext";
import { ErrorCode, isErrorCode } from "../../services/error";

type DeleteCustomerVoucherButtonProps = {
  customerId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerVoucherButton: FC<
  DeleteCustomerVoucherButtonProps
> = ({ customerId, onDelete, onError }) => {
  const [loading, setLoading] = useState(false);
  const { deleteCustomerVoucher } = useCustomers();
  const deleteHandler = () => {
    setLoading(true);
    deleteCustomerVoucher(customerId)
      .then(() => {
        setLoading(false);
        onDelete();
      })
      .catch((error) => {
        setLoading(false);
        if (isErrorCode(error.message)) {
          onError(error.message);
        } else {
          onError("INTERNAL_ERROR");
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
