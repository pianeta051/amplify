import { FC } from "react";
import { CustomerAddExternalLink } from "../CustomerAddExternalLink/CustomerAddExternalLink";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { CustomerExternalLink } from "../CustomerExternalLink/CustomerExternalLink";

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
        {links.map((url, index) => (
          <CustomerExternalLink
            url={url}
            key={url}
            index={index}
            customerId={customerId}
          />
        ))}
        <ListItem disablePadding></ListItem>
      </List>
      <CustomerAddExternalLink customerId={customerId} />
    </>
  );
};
