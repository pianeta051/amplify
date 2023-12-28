import { FC, useState } from "react";
import { Customer } from "../../services/customers";
import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ErrorCode } from "../../services/error";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { DeleteCustomerButton } from "../DeleteCustomerButton/DeleteCustomerButton";
import { CustomerIcon } from "../CustomerIcon/CustomerIcon";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";

type CustomerInformationProps = {
  customer: Customer;
};

export const CustomerInformation: FC<CustomerInformationProps> = ({
  customer,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();
  const editClickHandler = () => navigate(`/customers/${customer.id}/edit`);
  const deleteCustomerHandler = () => navigate("/customers");
  const errorDeletingHandler = (code: ErrorCode) => setError(code);
  return (
    <>
      <Typography variant="h3" gutterBottom>
        {customer.name}
      </Typography>
      {error && <ErrorAlert code={error} />}
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
    </>
  );
};
