import { FC, useEffect, useState } from "react";
import { CustomerAddress as CustomerAddressType } from "../../services/customers";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { CustomerAddress } from "../CustomerAddress/CustomerAddress";
import { ErrorCode } from "../../services/error";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { useCustomers } from "../../context/CustomersContext";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { DeleteCustomerMainAddressButton } from "../DeleteCustomerMainAddressButton/DeleteCustomerMainAddressButton";

type CustomerMainAddressProps = {
  customerId: string;
};

export const CustomerMainAddress: FC<CustomerMainAddressProps> = ({
  customerId,
}) => {
  const [address, setAddress] = useState<CustomerAddressType | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getMainAddress } = useCustomers();

  useEffect(() => {
    if (loading) {
      getMainAddress(customerId)
        .then((address) => {
          setAddress(address);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  }, [loading, customerId, getMainAddress]);

  const addMainAddressHandler = () =>
    navigate(`/customers/${customerId}/main-address/add`);

  const deleteErrorHandler = (code: ErrorCode) => {
    setError(code);
  };

  const deleteHandler = () => {
    setAddress(null);
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
  if (!address) {
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
      <CustomerAddress address={address} />
    </>
  );
};
