import { FC } from "react";
import { VoucherDetail } from "../../services/customers";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

type CustomerVoucherProps = {
  voucherDetail: VoucherDetail;
};

export const CustomerVoucher: FC<CustomerVoucherProps> = ({
  voucherDetail,
}) => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Discount Voucher
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="Voucher ID"
            secondary={voucherDetail.voucherId}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Value" secondary={voucherDetail.value} />
        </ListItem>
        <Divider />
      </List>
    </>
  );
};
