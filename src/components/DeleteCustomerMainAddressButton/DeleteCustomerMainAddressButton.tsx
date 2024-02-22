import LoadingButton from "@mui/lab/LoadingButton";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteMainAddress } from "../../hooks/useMainAddress/useDeleteMainAddress";

type DeleteCustomerMainAddressButtonProps = {
  customerId: string;
};

export const DeleteCustomerMainAddressButton: FC<
  DeleteCustomerMainAddressButtonProps
> = ({ customerId }) => {
  const { deleteCustomerMainAddress, error, loading } =
    useDeleteMainAddress(customerId);
  const navigate = useNavigate();

  const deleteHandler = () => {
    deleteCustomerMainAddress()
      .then(() => {
        navigate(`/customers/${customerId}`);
      })
      .catch(() => {
        if (error) {
          console.error(error);
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
