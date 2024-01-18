import { FC } from "react";
import { CustomerAddress as CustomerAddressType } from "../../services/customers";
import { Divider, List, ListItem, ListItemText } from "@mui/material";

type CustomerAddressProps = {
  address: CustomerAddressType;
};

export const CustomerAddress: FC<CustomerAddressProps> = ({ address }) => {
  return (
    <List>
      <ListItem>
        <ListItemText primary="Street" secondary={address.street} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Number" secondary={address.number} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="City" secondary={address.city} />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Postcode" secondary={address.postcode} />
      </ListItem>
    </List>
  );
};
