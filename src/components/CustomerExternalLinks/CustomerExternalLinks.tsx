import { FC } from "react";
import { CustomerAddExternalLink } from "../CustomerAddExternalLink/CustomerAddExternalLink";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

type CustomerExternalLinksProps = {
  links: string[];
  customerId: string;
};

export const CustomerExternalLinks: FC<CustomerExternalLinksProps> = ({
  links,
  customerId,
}) => {
  return (
    <>
      <List>
        {links.map((url) => (
          <ListItemButton component="a" href={url} key={url} target="_blank">
            <ListItemText primary={url} />
          </ListItemButton>
        ))}
        <ListItem disablePadding></ListItem>
      </List>
      <CustomerAddExternalLink customerId={customerId} />
    </>
  );
};
