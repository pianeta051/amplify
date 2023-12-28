import { FC, useState } from "react";
import { VoucherDetail } from "../../services/customers";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { ErrorCode } from "../../services/error";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import { DeleteCustomerVoucherButton } from "../DeleteCustomerVoucherButton/DeleteCustomerVoucherButton";

type CustomerVoucherProps = {
  voucher: VoucherDetail;
  customerId: string;
  onDelete: () => void;
};

export const CustomerVoucher: FC<CustomerVoucherProps> = ({
  voucher,
  customerId,
  onDelete,
}) => {
  const [error, setError] = useState<ErrorCode | null>(null);
  const navigate = useNavigate();
  const errorHandler = (error: ErrorCode) => {
    setError(error);
  };
  const editClickHandler = () => {
    navigate(`/customers/${customerId}/voucher-detail/edit`);
  };
  return (
    <>
      <Typography variant="h3" gutterBottom>
        Voucher details
      </Typography>
      {error && <ErrorAlert code={error} />}
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={editClickHandler}>
          Edit
        </Button>
        <DeleteCustomerVoucherButton
          customerId={customerId}
          onDelete={onDelete}
          onError={errorHandler}
        />
      </Stack>
      <List>
        <ListItem>
          <ListItemText primary="Voucher ID" secondary={voucher.voucherId} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Value" secondary={voucher.value} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Type" secondary={voucher.type} />
        </ListItem>
      </List>
    </>
  );
};
