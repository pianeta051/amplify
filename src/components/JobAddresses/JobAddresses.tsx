import { FC } from "react";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useJobAddresses } from "../../hooks/useAddress/useJobAddresses";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";

type JobAddressesProps = {
  jobId: string;
};

export const JobAddresses: FC<JobAddressesProps> = ({ jobId }) => {
  const { addresses, moreToLoad, error, loading, loadMore, loadingMore } =
    useJobAddresses(jobId);

  if (error) {
    return <ErrorAlert code={error} />;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Street</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Postal code</TableCell>
              <TableCell>City</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell>
                  <Link
                    to={`/customers/${address.customerId}/address/${address.id}`}
                  >
                    {address.id === "main"
                      ? "Main address"
                      : "Secondary address"}
                  </Link>
                </TableCell>
                <TableCell>{address.street}</TableCell>
                <TableCell>{address.number}</TableCell>
                <TableCell>{address.postcode}</TableCell>
                <TableCell>{address.city}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {moreToLoad && (
        <LoadingButton variant="text" onClick={loadMore} loading={loadingMore}>
          Load more
        </LoadingButton>
      )}
    </>
  );
};
