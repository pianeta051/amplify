import { FC } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useDeleteCustomerSecondaryAddress } from "../../hooks/useSecondaryAddress/useDeleteCustomerSecondaryAddress";

type DeleteCustomerSecondaryAddressButtonProps = {
  customerId: string;
  addressId: string;
};

export const DeleteCustomerSecondaryAddressButton: FC<
  DeleteCustomerSecondaryAddressButtonProps
> = ({ customerId, addressId }) => {
  const { deleteSecondaryAddress, loading, error } =
    useDeleteCustomerSecondaryAddress(customerId);
  const navigate = useNavigate();

  const deleteHandler = () => {
    deleteSecondaryAddress(addressId)
      .then(() => navigate(`/customers/${customerId}?tab=secondaryAddresses`))
      .catch(() => {
        if (error) {
          console.error(error);
        }
      });
  };

  return (
    <LoadingButton
      aria-label="delete"
      loading={loading}
      onClick={deleteHandler}
      color="inherit"
    >
      <DeleteIcon />
    </LoadingButton>
  );
};
