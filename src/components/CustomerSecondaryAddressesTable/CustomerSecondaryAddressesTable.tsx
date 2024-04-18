import { FC } from "react";
import { CustomerSecondaryAddress } from "../../services/customers";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type CustomerSecondaryAddressesTableProps = {
  addresses: CustomerSecondaryAddress[];
};

export const CustomerSecondaryAddressesTable: FC<
  CustomerSecondaryAddressesTableProps
> = ({ addresses }) => {
  return (
    <TableContainer component={Paper}>
      <TableHead>
        <TableRow>
          <TableCell>Street</TableCell>
          <TableCell>Number</TableCell>
          <TableCell>Postal code</TableCell>
          <TableCell>City</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {addresses.map((address) => (
          <TableRow key={address.id}>
            <TableCell>{address.street}</TableCell>
            <TableCell>{address.number}</TableCell>
            <TableCell>{address.postcode}</TableCell>
            <TableCell>{address.city}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};
