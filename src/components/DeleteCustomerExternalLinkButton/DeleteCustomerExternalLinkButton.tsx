import { FC } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteCustomerExternalLink } from "../../hooks/useExternalLink/useDeleteCustomerExternalLink";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

type DeleteCustomerExternalLinkButtonProps = {
  customerId: string;
  index: number;
};

export const DeleteCustomerExternalLinkButton: FC<
  DeleteCustomerExternalLinkButtonProps
> = ({ customerId, index }) => {
  const { deleteCustomerExternalLink, loading, error } =
    useDeleteCustomerExternalLink(customerId);
  const navigate = useNavigate();

  const deleteHandler = () => {
    deleteCustomerExternalLink(index)
      .then(() => navigate(`/customers/${customerId}?tab=externalLinks`))
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
