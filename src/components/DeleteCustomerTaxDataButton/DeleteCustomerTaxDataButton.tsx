import LoadingButton from "@mui/lab/LoadingButton";
import { FC } from "react";
import { useDeleteTaxData } from "../../hooks/useTaxData/useDeleteTaxData";
import { ErrorCode } from "../../services/error";

type DeleteCustomerTaxDataButtonProps = {
  customerId: string;
  onError: (code: ErrorCode) => void;
};

export const DeleteCustomerTaxDataButton: FC<
  DeleteCustomerTaxDataButtonProps
> = ({ customerId, onError }) => {
  const { deleteCustomerTaxData, loading, error } =
    useDeleteTaxData(customerId);
  const deleteHandler = () => {
    deleteCustomerTaxData().catch(() => {
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
