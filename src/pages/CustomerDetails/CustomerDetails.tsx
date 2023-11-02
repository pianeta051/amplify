import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Customer } from "../../services/customers";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { CustomerIcon } from "../../components/CustomerIcon/CustomerIcon";
import { DeleteCustomerButton } from "../../components/DeleteCustomerButton/DeleteCustomerButton";
import { useCustomers } from "../../context/CustomersContext";
import AddIcon from "@mui/icons-material/Add";

type CustomerDetailsParams = {
  id: string;
};

export const CustomerDetailsPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { id } = useParams<CustomerDetailsParams>();
  const navigate = useNavigate();
  const { getCustomer } = useCustomers();

  const editClickHandler = () => navigate(`/customers/${id}/edit`);
  const deleteCustomerHandler = () => navigate("/customers");
  const errorDeletingHandler = (code: ErrorCode) => setError(code);
  const addTaxDataHandler = () => navigate(`/customers/${id}/tax-data/add`);

  useEffect(() => {
    if (loading && id) {
      getCustomer(id)
        .then((customer) => {
          setCustomer(customer);
          setLoading(false);
        })
        .catch((error) => {
          if (isErrorCode(error.message)) {
            setError(error.message);
          } else {
            setError("INTERNAL_ERROR");
          }
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    <>
      <Typography variant="h3" gutterBottom>
        Customer details page
      </Typography>
      <CircularProgress />
    </>;
  }
  if (error) {
    return <Error code={error} />;
  }
  if (!id) {
    return <Error code="INTERNAL_ERROR" />;
  }
  if (!customer) {
    return <Error code="INTERNAL_ERROR" />;
  }
  return (
    <>
      <Typography variant="h3" gutterBottom>
        {customer.name}
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={editClickHandler}>
          Edit
        </Button>
        <DeleteCustomerButton
          customerId={customer.id}
          onDelete={deleteCustomerHandler}
          onError={errorDeletingHandler}
        />
      </Stack>

      <List>
        <ListItem disablePadding>
          <ListItemIcon>
            <AlternateEmailIcon />
          </ListItemIcon>
          <ListItemText primary="Email" secondary={customer.email} />
        </ListItem>
        <ListItem disablePadding>
          <ListItemIcon>
            <CustomerIcon type={customer.type} />
          </ListItemIcon>
          <ListItemText primary="Type" secondary={customer.type} />
        </ListItem>
      </List>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addTaxDataHandler}
      >
        Add tax data
      </Button>
    </>
  );
};
