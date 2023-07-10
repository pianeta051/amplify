import { FC } from "react";
import { Customer } from "../../services/customers";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AltRouteIcon from "@mui/icons-material/AltRoute";

type CustomerIconProps = {
  type: Customer["type"];
};

const icons: { [type in Customer["type"]]: FC } = {
  individual: () => <PersonIcon />,
  company: () => <WorkIcon />,
  other: () => <AltRouteIcon />,
};

export const CustomerIcon: FC<CustomerIconProps> = ({ type }) => {
  const IconComponent = icons[type];
  return <IconComponent />;
};
