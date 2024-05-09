import { FC } from "react";
import { CustomerSecondaryAddress } from "../../services/customers";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { DeleteCustomerSecondaryAddressButton } from "../DeleteCustomerSecondaryAddressButton/DeleteCustomerSecondaryAddressButton";
import { Link } from "react-router-dom";

type CustomerAddressesTableProps = {
  addresses: CustomerSecondaryAddress[];
  customerId: string;
  onEditClick: (addressId: string) => void;
};

export const CustomerAddressesTable: FC<CustomerAddressesTableProps> = ({
  addresses,
  customerId,
  onEditClick,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Street</TableCell>
            <TableCell>Number</TableCell>
            <TableCell>Postal code</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Update</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell>
                <Link to={`/customers/${customerId}/address/${address.id}`}>
                  {address.id === "main" ? "Main address" : "Secondary address"}
                </Link>
              </TableCell>
              <TableCell>{address.street}</TableCell>
              <TableCell>{address.number}</TableCell>
              <TableCell>{address.postcode}</TableCell>
              <TableCell>{address.city}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => onEditClick(address.id)}
                >
                  <EditIcon />
                </Button>
              </TableCell>
              <TableCell>
                {address.id !== "main" && (
                  <DeleteCustomerSecondaryAddressButton
                    customerId={customerId}
                    addressId={address.id}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
