import { FC } from "react";
import { TaxData } from "../../services/customers";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

type CustomerTaxDataProps = {
  taxData: TaxData;
};

export const CustomerTaxData: FC<CustomerTaxDataProps> = ({ taxData }) => {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Tax data
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Tax ID" secondary={taxData.taxId} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Company name"
            secondary={taxData.companyName}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Company address"
            secondary={taxData.companyAddress}
          />
        </ListItem>
      </List>
    </>
  );
};
