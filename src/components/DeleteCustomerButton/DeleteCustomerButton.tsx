import { FC, useState } from "react";
import { deleteCustomer } from "../../services/customers";
import { LoadingButton } from "@mui/lab";
import { ErrorCode, isErrorCode } from "../../services/error";

type DeleteCustomerButtonProps = {
  customerId: string;
  onDelete: () => void;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerButton: FC<DeleteCustomerButtonProps> = ({
  customerId,
  onDelete,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const deleteHandler = () => {
    setLoading(true);
    deleteCustomer(customerId)
      .then(() => {
        setLoading(false);
        onDelete();
      })
      .catch((error) => {
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
