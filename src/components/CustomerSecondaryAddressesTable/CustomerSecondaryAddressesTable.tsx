import { FC } from "react";
import { CustomerSecondaryAddress } from "../../services/customers";
import {
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteCustomerSecondaryAddressButton } from "../DeleteCustomerSecondaryAddressButton/DeleteCustomerSecondaryAddressButton";

type CustomerSecondaryAddressesTableProps = {
  addresses: CustomerSecondaryAddress[];
  customerId: string;
  onEditClick: (addressId: string) => void;
};

export const CustomerSecondaryAddressesTable: FC<
  CustomerSecondaryAddressesTableProps
> = ({ addresses, customerId, onEditClick }) => {
  return (
    <TableContainer component={Paper}>
      <TableHead>
        <TableRow>
          <TableCell>Street</TableCell>
          <TableCell>Number</TableCell>
          <TableCell>Postal code</TableCell>
          <TableCell>City</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {addresses.map((address) => (
          <TableRow key={address.id}>
            <TableCell>{address.street}</TableCell>
            <TableCell>{address.number}</TableCell>
            <TableCell>{address.postcode}</TableCell>
            <TableCell>{address.city}</TableCell>
            <TableCell>
              <IconButton
                edge="end"
                aria-label="update"
                onClick={() => onEditClick(address.id)}
              >
                <EditIcon />
              </IconButton>
              <DeleteCustomerSecondaryAddressButton
                customerId={customerId}
                addressId={address.id}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableContainer>
  );
};
