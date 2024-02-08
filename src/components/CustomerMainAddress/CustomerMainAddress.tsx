import { FC } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { ErrorCode } from "../../services/error";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { DeleteCustomerMainAddressButton } from "../DeleteCustomerMainAddressButton/DeleteCustomerMainAddressButton";
import { useMainAddress } from "../../hooks/useMainAddress/useMainAddress";

type CustomerMainAddressProps = {
  customerId: string;
};

export const CustomerMainAddress: FC<CustomerMainAddressProps> = ({
  customerId,
}) => {
  const navigate = useNavigate();

  const { mainAddress, loading, error } = useMainAddress(customerId);

  const addMainAddressHandler = () =>
    navigate(`/customers/${customerId}/main-address/add`);

  const deleteErrorHandler = (code: ErrorCode) => {
    console.log(code);
  };

  const deleteHandler = () => {
    console.log("deleted");
  };
  const editClickHandler = () => {
    navigate(`/customers/${customerId}/main-address/edit`);
  };
  if (loading) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Main address
        </Typography>
        <CircularProgress />
      </>
    );
  }
  if (error) {
    return <ErrorAlert code={error} />;
  }
  if (!mainAddress) {
    return (
      <>
        <Typography variant="h3" gutterBottom>
          Main address
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addMainAddressHandler}
        >
          Add main address
        </Button>
      </>
    );
  }
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Main address
      </Typography>
      {error && <ErrorAlert code={error} />}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={editClickHandler}>
          Edit
        </Button>
        <DeleteCustomerMainAddressButton
          customerId={customerId}
          onDelete={deleteHandler}
          onError={deleteErrorHandler}
        />
      </Stack>
      <CustomerAddress address={mainAddress} />
    </>
  );
};
