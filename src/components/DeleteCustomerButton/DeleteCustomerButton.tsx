import { FC } from "react";
import { LoadingButton } from "@mui/lab";
import { ErrorCode } from "../../services/error";
import { useDeleteCustomer } from "../../hooks/useCustomer/useDeleteCustomer";

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
  const { deleteCustomer, loading, error } = useDeleteCustomer(customerId);
  const deleteHandler = () => {
    deleteCustomer()
      .then(() => {
        onDelete();
      })
      .catch(() => {
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
