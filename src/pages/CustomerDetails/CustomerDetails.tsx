import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Customer, getCustomer } from "../../services/customers";
import { ErrorCode, isErrorCode } from "../../services/error";
import { Error } from "../../components/Error/Error";
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { CustomerIcon } from "../../components/CustomerIcon/CustomerIcon";

type CustomerDetailsParams = {
  id: string;
};

export const CustomerDetailsPage: FC = () => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<ErrorCode | null>(null);
  const { id } = useParams<CustomerDetailsParams>();
  const navigate = useNavigate();

  const editClickHandler = () => navigate(`/customers/${id}/edit`);

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
      <Button variant="contained" onClick={editClickHandler}>
        Edit
      </Button>

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
    </>
  );
};
