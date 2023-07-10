import { FC } from "react";
import { Avatar, ListItemAvatar, ListItemText } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import { Customer } from "../../services/customers";

type CustomerItemProps = {
  customer: Customer;
};

const icons: { [type in Customer["type"]]: FC } = {
  individual: () => <PersonIcon />,
  company: () => <WorkIcon />,
  other: () => <AltRouteIcon />,
};

export const CustomerItem: FC<CustomerItemProps> = ({ customer }) => {
  const IconComponent = icons[customer.type];
  return (
    <>
      <ListItemAvatar>
        <Avatar>
          <IconComponent />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={customer.name} secondary={customer.email} />
    </>
  );
};
