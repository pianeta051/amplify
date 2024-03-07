import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { FC } from "react";
import { DeleteCustomerExternalLinkButton } from "../DeleteCustomerExternalLinkButton/DeleteCustomerExternalLinkButton";

type CustomerExternalLinkProps = {
  url: string;
  customerId: string;
  index: number;
};
export const CustomerExternalLink: FC<CustomerExternalLinkProps> = ({
  url,
  customerId,
  index,
}) => {
  return (
    <ListItem
      secondaryAction={
        <DeleteCustomerExternalLinkButton
          customerId={customerId}
          index={index}
        />
      }
    >
      <ListItemButton component="a" href={url} target="_blank">
        <ListItemText primary={url} />
      </ListItemButton>
    </ListItem>
  );
};
